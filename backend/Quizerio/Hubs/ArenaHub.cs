using Microsoft.AspNetCore.SignalR;
using Quizerio.Infrastructure; // ovde je tvoj AppDbContext
using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Quizerio.DTO;
using Quizerio.Models;
using System.Text.Json;

namespace Quizerio.Hubs
{
    public class ArenaHub : Hub
    {
        private readonly AppDbContext _context;
        private static readonly Dictionary<int, Dictionary<string, int>> _roomScores = new();
        public ArenaHub(AppDbContext context)
        {
            _context = context;
        }

        public async Task JoinRoom(int roomId, int userId)
        {
            try
            {
                if (roomId <= 0)
                    throw new HubException("Invalid roomId");

                var room = await _context.CompetitionRooms.FindAsync(roomId);
                if (room == null) throw new HubException("Room not found");

                if (room != null)
                {
                    var secondsToStart = (int)(room.StartTime - DateTime.UtcNow).TotalSeconds -7200;
                    if (secondsToStart < 0) secondsToStart = 0;

                    await Clients.Caller.SendAsync("QuizStartingIn", secondsToStart);
                }

                if (DateTime.UtcNow >= room.StartTime)
                    throw new HubException("Quiz has already started, joining is not allowed");
                

                var user = await _context.Users
                    .AsNoTracking()
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                    throw new HubException("User not found");

                await Groups.AddToGroupAsync(Context.ConnectionId, $"room-{roomId}");

                // šalje ime korisnika
                await Clients.Group($"room-{roomId}")
                    .SendAsync("UserJoined", new { user.Username });

                Console.WriteLine($"User {user.Username} (id {user.Id}) joined room {roomId}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"JoinRoom error: {ex.Message}");
                throw new HubException($"JoinRoom failed: {ex.Message}");
            }
        }



        public async Task SubmitAnswer(int roomId, int userId, int questionId, JsonElement answer, int timeLeft)
        {
            Console.WriteLine($"SubmitAnswer raw: roomId={roomId}, userId={userId}, questionId={questionId}, answer={answer}, timeLeft={timeLeft}");
            try
            {
                if (roomId <= 0)
                    throw new HubException("Invalid roomId");
                if (userId <= 0)
                    throw new HubException("Invalid userId");

                var room = await _context.CompetitionRooms.AsNoTracking().FirstOrDefaultAsync(r => r.Id == roomId)
                           ?? throw new HubException("Room not found");
                var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId)
                           ?? throw new HubException("User not found");
                var question = await _context.Questions.AsNoTracking().FirstOrDefaultAsync(q => q.Id == questionId)
                               ?? throw new HubException("Question not found");

                bool isCorrect = false;
                int earnedPoints = 0;

                switch (question.Type)
                {
                    case QuestionType.SingleChoice:
                    case QuestionType.TrueFalse:
                        if (answer.ValueKind == JsonValueKind.Number)
                        {
                            int idx = answer.GetInt32();
                            isCorrect = question.CorrectOptionIndexes.Contains(idx);
                        }
                        break;

                    case QuestionType.MultipleChoice:
                        if (answer.ValueKind == JsonValueKind.Array)
                        {
                            var submitted = answer.EnumerateArray().Select(x => x.GetInt32()).ToList();
                            isCorrect = submitted.OrderBy(x => x)
                                         .SequenceEqual(question.CorrectOptionIndexes.OrderBy(x => x));
                        }
                        break;

                    case QuestionType.FillInTheBlank:
                        if (answer.ValueKind == JsonValueKind.String)
                        {
                            var submitted = answer.GetString();
                            isCorrect = string.Equals(submitted?.Trim(), question.CorrectAnswerText?.Trim(), StringComparison.OrdinalIgnoreCase);
                        }
                        break;
                }

                if (isCorrect)
                    earnedPoints = question.Points + Math.Max(0, timeLeft);

                AddPoints(roomId, user.Username, earnedPoints);


                Console.WriteLine($"User {user.Username} answered Q{questionId} → correct={isCorrect}, points={earnedPoints}, timeLeft={timeLeft}");


                await Clients.Caller.SendAsync("AnswerChecked", new
                {
                    QuestionId = questionId,
                    IsCorrect = isCorrect,
                    Points = earnedPoints,
                    TimeLeft = timeLeft
                });


            }
            catch (Exception ex)
            {
                Console.WriteLine($"SubmitAnswer error: {ex.Message}");
                throw new HubException($"SubmitAnswer failed: {ex.Message}");
            }
        }


        public async Task SendLeaderboard(int roomId)
        {
            var leaderboard = GetLeaderboard(roomId)
                .Select(l => new {
                    Username = l.GetType().GetProperty("Username")!.GetValue(l),
                    Points = l.GetType().GetProperty("Points")!.GetValue(l)
                })
                .ToList();

            var room = await _context.CompetitionRooms.FindAsync(roomId);
            
            _context.CompetitionRooms.Remove(room);
            await _context.SaveChangesAsync();

            Console.WriteLine($"Leaderboard sent for room {roomId}");

            await Clients.Group($"room-{roomId}")
                .SendAsync("ShowLeaderboard", leaderboard);

            Console.WriteLine($"Leaderboard sent for room {roomId}");
        }


        private void AddPoints(int roomId, string username, int points)
        {
            if (!_roomScores.ContainsKey(roomId))
                _roomScores[roomId] = new Dictionary<string, int>();

            if (!_roomScores[roomId].ContainsKey(username))
                _roomScores[roomId][username] = 0;
            

            _roomScores[roomId][username] += points;
        }

        private List<object> GetLeaderboard(int roomId)
        {
            if (!_roomScores.ContainsKey(roomId))
                return new List<object>();

            
            return _roomScores[roomId]
                .OrderByDescending(kv => kv.Value)
                .Select(kv => new { Username = kv.Key, Points = kv.Value })
                .ToList<object>();
        }
    }
}
