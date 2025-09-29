using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Quizerio.DTO;
using Quizerio.Interfaces;
using Quizerio.Models;
using Quizerio.Infrastructure;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Quizerio.Services
{
    public class ResultService : IResultService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ResultService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }


        public async Task<ResultDto> CreateAsync(ResultDto resultDto)
        {
            var result = _mapper.Map<Result>(resultDto);
            _context.Results.Add(result);
            await _context.SaveChangesAsync();
            return _mapper.Map<ResultDto>(result);
        }

        public async Task<ResultDto?> UpdateAsync(int id, ResultDto resultDto)
        {
            var result = await _context.Results.FindAsync(id);
            if (result == null) return null;

            _mapper.Map(resultDto, result);
            await _context.SaveChangesAsync();
            return _mapper.Map<ResultDto>(result);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var result = await _context.Results.FindAsync(id);
            if (result == null) return false;

            _context.Results.Remove(result);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<ResultDto>> GetUserResultsAsync(int userId)
        {
            var results = await _context.Results
                .Include(r => r.Answers) // ako ima Answers relacija
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.TakenAt)
                .ToListAsync();

            
            return _mapper.Map<List<ResultDto>>(results);

            /* ako hoćeš ručno da mapiraš:
            return results.Select(r => new ResultDto
            {
                Id = r.Id,
                UserId = r.UserId,
                QuizId = r.QuizId,
                Score = r.Score,
                TakenAt = r.TakenAt,
                Answers = r.Answers.Select(a => new UserAnswerDto
                {
                    QuestionId = a.QuestionId,
                    UserAnswerText = a.UserAnswerText,
                    CorrectAnswerText = a.CorrectAnswerText,
                    IsCorrect = a.IsCorrect
                }).ToList()
            }).ToList();*/
        }

        public async Task<ResultDto> SubmitAsync(SubmitResultDto dto)
        {
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                .FirstOrDefaultAsync(q => q.Id == dto.QuizId);

            if (quiz == null) throw new Exception("Quiz not found");

            int totalScore = 0;
            var userAnswers = new List<UserAnswer>();

            foreach (var q in quiz.Questions)
            {
                var userAnswerDto = dto.Answers.FirstOrDefault(a => a.QuestionId == q.Id);
                if (userAnswerDto == null) continue;

                bool isCorrect = false;
                int questionPoints = q.Points;

                switch (q.Type)
                {
                    case QuestionType.SingleChoice:
                    case QuestionType.TrueFalse:
                        isCorrect = userAnswerDto.SelectedOptionIndexes != null &&
                                    userAnswerDto.SelectedOptionIndexes.Count > 0 &&
                                    userAnswerDto.SelectedOptionIndexes.First() == q.CorrectOptionIndexes.First();
                        break;
                    case QuestionType.MultipleChoice:
                        var correctSet = q.CorrectOptionIndexes.OrderBy(i => i);
                        var selectedSet = userAnswerDto.SelectedOptionIndexes.OrderBy(i => i);
                        isCorrect = correctSet.SequenceEqual(selectedSet);
                        break;

                    case QuestionType.FillInTheBlank:
                        isCorrect = string.Equals(userAnswerDto.UserAnswer?.Trim(), q.CorrectAnswerText?.Trim(), StringComparison.OrdinalIgnoreCase);
                        break;
                }

                if (isCorrect) totalScore += questionPoints;

                userAnswers.Add(new UserAnswer
                {
                    QuestionId = q.Id,
                    UserAnswerText = userAnswerDto.UserAnswer,
                    CorrectAnswerText = q.CorrectAnswerText ?? string.Join(", ", q.Options),
                    IsCorrect = isCorrect
                });
            }



            var result = new Result
            {
                QuizTitle = quiz.Title,
                UserId = dto.UserId,
                QuizId = dto.QuizId,
                Score = totalScore,
                TakenAt = DateTime.UtcNow,
                Answers = userAnswers
            };

            _context.Results.Add(result);
            await _context.SaveChangesAsync();

            // Map entity to DTO
            return _mapper.Map<ResultDto>(result);
        }

       public async Task<List<ResultDto>> GetUserResultsProgressAsync(int userId, int quizId) 
        {
            var query = _context.Results
                                .Include(r => r.Answers)
                                .Where(r => r.UserId == userId && r.QuizId == quizId)
                                .OrderBy(r => r.TakenAt);

            var results = await query.ToListAsync();

            return _mapper.Map<List<ResultDto>>(results);
        }

        public async Task<List<LeaderboardDto>> GetLeaderboardAsync(int quizId, string period)
        {
            var query = _context.Results
                .Where(r => r.QuizId == quizId);

            if (period == "weekly")
            {
                var start = DateTime.UtcNow.AddDays(-7);
                query = query.Where(r => r.TakenAt >= start);
            }
            else if (period == "monthly")
            {
                var start = DateTime.UtcNow.AddMonths(-1);
                query = query.Where(r => r.TakenAt >= start);
            }

            var list = await query.ToListAsync();

            var bestPerUser = list
                .GroupBy(r => r.UserId)
                .Select(g => g.OrderByDescending(r => r.Score)
                              .ThenBy(r => r.TakenAt)
                              .First())
                .Select(r => new LeaderboardDto
                {
                    UserId = r.UserId,
                    Username = _context.Users.Where(u => u.Id == r.UserId).Select(u => u.Username).FirstOrDefault() ?? "Unknown",
                    Score = r.Score,
                    TakenAt = r.TakenAt
                })
                .OrderByDescending(r => r.Score)
                .ThenBy(r => r.TakenAt)
                .ToList();

            return bestPerUser;
        }





    }
}
