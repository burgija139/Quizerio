using Quizerio.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Quizerio.Interfaces
{
    public interface IQuestionService
    {
        Task<IEnumerable<QuizDto>> GetAllAsync();
        Task<QuizDto?> GetByIdAsync(int id);
        Task<QuizDto> CreateAsync(QuizDto quizDto);
        Task<QuizDto?> UpdateAsync(int id, QuizDto quizDto);
        Task<bool> DeleteAsync(int id);
    }
}
