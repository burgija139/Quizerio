namespace Quizerio.DTO
{
    public class CompetitionRoomReadDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public int QuizId { get; set; }
        public string QuizName { get; set; } = null!;
        public DateTime StartTime { get; set; }
        public bool Started { get; set; }
    }

}
