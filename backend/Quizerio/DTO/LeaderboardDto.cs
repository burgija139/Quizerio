namespace Quizerio.DTO
{
    public class LeaderboardDto
    {
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public int Score { get; set; }
        public DateTime TakenAt { get; set; }
    }

}
