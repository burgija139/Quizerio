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
    public class ArenaService : IArenaService
    {
        private readonly AppDbContext _context;

        public ArenaService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<CompetitionRoom> CreateRoomAsync(CompetitionRoomDto dto, string userId)
        {
            if (dto == null) throw new ArgumentException("Invalid room data.");

            // Provera da li postoji kviz
            var quiz = await _context.Quizzes.FindAsync(dto.QuizId);
            if (quiz == null) throw new ArgumentException("Quiz not found.");

            var room = new CompetitionRoom
            {
                Name = dto.Name,
                QuizId = dto.QuizId,
                StartTime = dto.StartTime,
                CreatedByUserId = userId
            };

            _context.CompetitionRooms.Add(room);
            await _context.SaveChangesAsync();
            return room;
        }
        public async Task<List<CompetitionRoomReadDto>> GetRoomsAsync()
        {
            return await (from room in _context.CompetitionRooms
                          join quiz in _context.Quizzes on room.QuizId equals quiz.Id
                          orderby room.Name
                          select new CompetitionRoomReadDto
                          {
                              Id = room.Id,
                              Name = room.Name,
                              QuizId = room.QuizId,
                              QuizName = quiz.Title, // uzimamo ime kviza iz tabele Quiz
                              StartTime = room.StartTime
                          }).ToListAsync();
        }
    }
}
