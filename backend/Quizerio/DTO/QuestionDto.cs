using Quizerio.Models;
using System.Text.Json.Serialization;

namespace Quizerio.DTO
{
    public class QuestionDto
    {
        public int Id { get; set; }
        public string Text { get; set; }
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public QuestionType Type { get; set; }
        public List<string> Options { get; set; } = new List<string>();
        public List<int> CorrectOptionIndexes { get; set; } = new List<int>();
        public string CorrectAnswerText { get; set; }
        public int Points { get; set; }
        public int QuizId { get; set; }
    }
}
