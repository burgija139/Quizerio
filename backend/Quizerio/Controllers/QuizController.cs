using Microsoft.AspNetCore.Mvc;
using Quizerio.DTO;
using Quizerio.Interfaces;

namespace Quizerio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizController : ControllerBase
    {
        private readonly IQuizService _quizService;

        public QuizController(IQuizService quizService)
        {
            _quizService = quizService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _quizService.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var quiz = await _quizService.GetByIdAsync(id);
            if (quiz == null) return NotFound();
            return Ok(quiz);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] QuizDto quizDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var createdQuiz = await _quizService.CreateAsync(quizDto);
            return CreatedAtAction(nameof(GetById), new { id = createdQuiz.Id }, createdQuiz);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] QuizDto quizDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var updatedQuiz = await _quizService.UpdateAsync(id, quizDto);
            if (updatedQuiz == null) return NotFound();
            return Ok(updatedQuiz);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _quizService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
