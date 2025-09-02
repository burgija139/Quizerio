namespace Quizerio.Models
{
    public enum QuestionType
    {
        SingleChoice,     // 1 tačan odgovor
        MultipleChoice,   // više tačnih odgovora
        TrueFalse,        // tačno/netačno
        FillInTheBlank    // unos teksta
    }

    public class Question
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public QuestionType Type { get; set; }

        // Opcije (samo za SingleChoice i MultipleChoice)
        public List<string> Options { get; set; } = new List<string>();

        // Indeksi tačnih opcija (SingleChoice: 1 element, MultipleChoice: više)
        public List<int> CorrectOptionIndexes { get; set; } = new List<int>();

        // Za TrueFalse: opcionalno, može biti prva opcija true, druga false
        // Za FillInTheBlank: tačan odgovor može biti tekst
        public string CorrectAnswerText { get; set; }

        // FK
        public int QuizId { get; set; }
        public int Points { get; set; }
    }
}
