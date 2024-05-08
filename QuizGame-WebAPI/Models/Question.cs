namespace QuizGame.Models;

public class Question
{
    public int Id {get; set;}
    public string QuestionText {get; set;}
    public string? QuestionImage {get; set;}
    public int SecondsTimeout {get; set;} = 0;
    public double RelativeScore {get; set;} = 1;
    public Answer CorrectAnswer {get; set;}
    public IEnumerable<Answer> IncorrectAnswers {get; set;}
    // public Quiz Quiz {get; set;}

    internal Question()
    {
        
    }
    public Question(string text, CorrectAnswer answer, IEnumerable<IncorrectAnswer> answers)
    {
        QuestionText = text;
        CorrectAnswer = answer;
        IncorrectAnswers = answers;
    }
}