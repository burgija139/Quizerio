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
    public class QuizService : IQuizService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public QuizService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<QuizDto>> GetAllAsync()
        {
            var quizzes = await _context.Quizzes.ToListAsync();
            return _mapper.Map<IEnumerable<QuizDto>>(quizzes);
        }

        public async Task<QuizDto?> GetByIdAsync(int id)
        {
            var quiz = await _context.Quizzes
                .Include(q => q.Questions) 
                .FirstOrDefaultAsync(q => q.Id == id);

            if (quiz == null)
                return null;
            return _mapper.Map<QuizDto>(quiz);
        }

        public async Task<QuizDto> CreateAsync(QuizDto quizDto)
        {
            var quiz = _mapper.Map<Quiz>(quizDto);
            _context.Quizzes.Add(quiz);
            await _context.SaveChangesAsync();
            return _mapper.Map<QuizDto>(quiz);
        }

        public async Task<QuizDto?> UpdateAsync(int id, QuizDto quizDto)
        {
            var quiz = await _context.Quizzes.FindAsync(id);
            if (quiz == null) return null;

            _mapper.Map(quizDto, quiz);
            await _context.SaveChangesAsync();
            return _mapper.Map<QuizDto>(quiz);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var quiz = await _context.Quizzes.FindAsync(id);
            if (quiz == null) return false;

            _context.Quizzes.Remove(quiz);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
