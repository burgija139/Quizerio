using Quizerio.DTO;
using Quizerio.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Quizerio.Interfaces
{
    public interface IArenaService
    {
        Task<CompetitionRoom> CreateRoomAsync(CompetitionRoomDto dto, string userId);
        Task<List<CompetitionRoomReadDto>> GetRoomsAsync();
    }
}
