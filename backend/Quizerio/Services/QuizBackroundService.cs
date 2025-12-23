using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.SignalR;
using Quizerio.Hubs;
using Quizerio.Infrastructure;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Quizerio.Models;

namespace Quizerio.Services
{
    public class QuizBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _services;
        private readonly IHubContext<ArenaHub> _hubContext;

        public QuizBackgroundService(IServiceProvider services, IHubContext<ArenaHub> hubContext)
        {
            _services = services;
            _hubContext = hubContext;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = _services.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                // sve sobe kojima je prošao start a nisu pokrenute
                var roomsToStart = db.CompetitionRooms
                    .Where(r => r.StartTime <= DateTime.UtcNow.AddHours(2) && !r.Started)
                    .ToList();

                foreach (var room in roomsToStart)
                {
                    room.Started = true;
                    db.Update(room);
                    await db.SaveChangesAsync();

                    // paralelno startujemo kviz u toj sobi
                    _ = Task.Run(() => StartQuizForRoom(room.Id), stoppingToken);
                }

                await Task.Delay(TimeSpan.FromSeconds(1), stoppingToken);
            }
        }

        private async Task StartQuizForRoom(int roomId)
        {
            using var scope = _services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var quiz = db.Quizzes
                .Where(q => q.Id == db.CompetitionRooms.First(r => r.Id == roomId).QuizId)
                .Select(q => new
                {
                    Questions = q.Questions
                        .Select(x => new
                        {
                            x.Id,
                            x.Text,
                            Type = x.Type.ToString(),
                            x.Options,                // već lista stringova
                            x.CorrectOptionIndexes,   // lista int-ova
                            x.CorrectAnswerText,      // tekstualni odgovor (za FillInTheBlank)
                            x.Points,
                            Duration = 15         // hardkodirano vreme po pitanju (možeš kasnije da dodaš u model)
                        })
                        .ToList()
                })
                .First();

            foreach (var q in quiz.Questions)
            {
                // šaljemo pitanje svim korisnicima u sobi
                await _hubContext.Clients.Group($"room-{roomId}")
                    .SendAsync("ReceiveQuestion", new
                    {
                        q.Id,
                        q.Text,
                        q.Type,
                        q.Options,
                        q.Points
                    }, q.Duration);

                // čekaj dok ne istekne vreme za ovo pitanje
                await Task.Delay(TimeSpan.FromSeconds(q.Duration));
            }

            // kad završe sva pitanja

            await _hubContext.Clients.Group($"room-{roomId}")
                .SendAsync("QuizFinished");
        }
    }
}
