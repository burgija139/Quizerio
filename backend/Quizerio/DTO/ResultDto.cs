namespace Quizerio.DTO
{
    public class ResultDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int QuizId { get; set; }
        public int Score { get; set; }
        public DateTime TakenAt { get; set; }

        // List of answers
        public List<SubmitResultDto> Answers { get; set; } = new();
    }
}
