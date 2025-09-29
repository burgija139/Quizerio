namespace Quizerio.DTO
{
    public class UserAnswerDto
    {
        public int QuestionId { get; set; }
        public string UserAnswerText { get; set; } = string.Empty;
        public string CorrectAnswerText { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
    }
}
