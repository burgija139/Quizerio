using Microsoft.AspNetCore.Mvc;
using Quizerio.DTO;
using Quizerio.Interfaces;

namespace Quizerio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResultController : ControllerBase
    {
        private readonly IResultService _resultService;

        public ResultController(IResultService resultService)
        {
            _resultService = resultService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() { return null; }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            
            return null;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ResultDto resultDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var createdResult = await _resultService.CreateAsync(resultDto);
            return CreatedAtAction(nameof(GetById), new { id = createdResult.Id }, createdResult);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ResultDto resultDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var updatedResult = await _resultService.UpdateAsync(id, resultDto);
            if (updatedResult == null) return NotFound();
            return Ok(updatedResult);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _resultService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        [HttpPost("submit")]
        public async Task<IActionResult> Submit([FromBody] SubmitResultDto dto)
        {
            try
            {
                var resultDto = await _resultService.SubmitAsync(dto);
                return Ok(resultDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
