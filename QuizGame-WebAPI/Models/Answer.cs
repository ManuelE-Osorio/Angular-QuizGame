namespace QuizGame.Models;

public class Answer
{
    public int Id {get; set;}
    public string AnswerText {get; set;}
    public string? AnswerImage {get; set;}
    internal Answer() {}
    public Answer(string answerText)
    {
        AnswerText = answerText;
    }
}