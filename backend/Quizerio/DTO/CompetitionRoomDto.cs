namespace Quizerio.DTO
{
    public class CompetitionRoomDto
    {
        public string Name { get; set; } = null!;
        public int QuizId { get; set; }
        public DateTime StartTime { get; set; }
    }
}
