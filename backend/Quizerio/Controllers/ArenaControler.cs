using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Quizerio.DTO;
using Quizerio.Interfaces;
using Quizerio.Models;
using Quizerio.Services;
using System.Security.Claims;

namespace Quizerio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArenaController : ControllerBase
    {
        private readonly IArenaService _arenaService;

        public ArenaController(IArenaService arenaService)
        {
            _arenaService = arenaService;
        }

        [HttpPost("room")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateRoom([FromBody] CompetitionRoomDto dto)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userId == null) return Unauthorized();

                var room = await _arenaService.CreateRoomAsync(dto, userId);
                return Ok(room);
            }
            catch (ArgumentException ex) // npr. pogrešan quizId ili dto nevalidan
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // ovde možeš i logovanje ubaciti
                return StatusCode(500, new { message = "An error occurred while creating the room.", error = ex.Message });
            }
        }

        [HttpGet("list")]
        public async Task<IActionResult> GetRooms()
        {
            var rooms = await _arenaService.GetRoomsAsync();
            return Ok(rooms);
        }

    }
}
