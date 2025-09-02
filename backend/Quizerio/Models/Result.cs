namespace Quizerio.Models
{
    public class Result
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int QuizId { get; set; }
        public int Score { get; set; }
        public DateTime TakenAt { get; set; } = DateTime.UtcNow;

        // Navigacija
        public List<UserAnswer> Answers { get; set; } = new();
    }
}