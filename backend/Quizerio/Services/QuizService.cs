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
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                .FirstOrDefaultAsync(q => q.Id == id);
            if (quiz == null) return null;

            quiz.Title = quizDto.Title;
            quiz.Category = quizDto.Category;
            quiz.Difficulty = quizDto.Difficulty;
            quiz.TimeLimit = quizDto.TimeLimit;
            quiz.Questions.Clear();

            foreach (var qDto in quizDto.Questions)
            {
                quiz.Questions.Add(new Question
                {
                    Text = qDto.Text,
                    Type = (QuestionType)qDto.Type, // ovde castuješ
                    Options = qDto.Options,
                    CorrectOptionIndexes = qDto.CorrectOptionIndexes,
                    CorrectAnswerText = qDto.CorrectAnswerText,
                    Points = qDto.Points
                });
            }

            await _context.SaveChangesAsync();
            return new QuizDto
            {
                Id = quiz.Id,
                Title = quiz.Title,
                Category = quiz.Category,
                Difficulty = quiz.Difficulty,
                TimeLimit = quiz.TimeLimit,
                QuestionsCount = quiz.Questions.Count,
                Questions = quiz.Questions.Select(q => new QuestionDto
                {
                    Id = q.Id,
                    Text = q.Text,
                    Type = q.Type, // cast za frontend
                    Options = q.Options,
                    CorrectOptionIndexes = q.CorrectOptionIndexes,
                    CorrectAnswerText = q.CorrectAnswerText,
                    Points = q.Points
                }).ToList()
            };
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
