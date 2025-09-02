using Quizerio.Models;
using System.Text.Json.Serialization;

namespace Quizerio.DTO
{
    public class QuizDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public int TimeLimit { get; set; }
        public int QuestionsCount { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))] 
        public DifficultyLevel Difficulty { get; set; }
        public List<QuestionDto> Questions { get; set; } = new List<QuestionDto>();
    }
}
