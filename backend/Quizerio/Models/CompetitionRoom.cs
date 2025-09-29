namespace Quizerio.Models
{
    public class CompetitionRoom
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public int QuizId { get; set; }
        public DateTime StartTime { get; set; }
        public string CreatedByUserId { get; set; } = null!;
        public bool Started { get; set; }
    }
}
