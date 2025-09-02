namespace Quizerio.DTO
{
    public class SubmitResultDto
    {
        public int UserId { get; set; }
        public int QuizId { get; set; }
        public int TimeLeftSeconds { get; set; }
        public List<AnswerDto> Answers { get; set; } = new();
    }
}
