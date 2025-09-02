namespace Quizerio.Models
{
    public enum DifficultyLevel
    {
        Easy,
        Medium,
        Hard
    }

    public class Quiz
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public int TimeLimit { get; set; } // u minutima
        public int QuestionsCount { get; set; }
        public DifficultyLevel Difficulty { get; set; } // koristi enum
        public List<Question> Questions { get; set; } = new List<Question>();
    }
}
