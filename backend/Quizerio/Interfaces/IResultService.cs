using Quizerio.DTO;
using Quizerio.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Quizerio.Interfaces
{
    public interface IResultService
    {

        Task<ResultDto> CreateAsync(ResultDto resultDto);
        Task<ResultDto?> UpdateAsync(int id, ResultDto resultDto);
        Task<bool> DeleteAsync(int id);
        Task<ResultDto> SubmitAsync(SubmitResultDto dto);
    }
}
