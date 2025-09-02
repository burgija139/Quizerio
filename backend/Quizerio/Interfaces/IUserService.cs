using Quizerio.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Quizerio.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllAsync();
        Task<UserDto?> GetByIdAsync(int id);
        Task<UserDto> CreateAsync(UserDto userDto);
        Task<UserDto?> UpdateAsync(int id, UserDto userDto);
        Task<bool> DeleteAsync(int id);
        Task<UserDto> RegisterAsync(RegisterDto userDto);
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
    }
}