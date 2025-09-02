namespace Quizerio.Models
{
    public class UserAnswer
    {
        public int Id { get; set; }
        public int ResultId { get; set; }
        public int QuestionId { get; set; }
        public string UserAnswerText { get; set; } = string.Empty;
        public string CorrectAnswerText { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
    }
}
