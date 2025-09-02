namespace Quizerio.DTO
{
    public class AnswerDto
    {
        public int QuestionId { get; set; }
        public string UserAnswer { get; set; }
        public List<int> SelectedOptionIndexes { get; set; } = new();
    }
}
