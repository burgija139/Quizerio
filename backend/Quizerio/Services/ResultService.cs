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
                        isCorrect = userAnswerDto.SelectedOptionIndexes.FirstOrDefault() == q.CorrectOptionIndexes.FirstOrDefault();
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

            int timeBonus = Math.Max(1, Math.Min(10, (int)Math.Ceiling(dto.TimeLeftSeconds / 60.0)));
            totalScore += timeBonus;

            var result = new Result
            {
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

    }
}
