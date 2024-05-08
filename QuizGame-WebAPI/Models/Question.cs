using System.ComponentModel.DataAnnotations;

namespace QuizGame.Models;

public class Question
{
    public int Id {get; set;}

    [Required, StringLength(500, MinimumLength = 3)]
    public string QuestionText {get; set;}
    public string? QuestionImage {get; set;}
    public int SecondsTimeout {get; set;} = 0;
    public double RelativeScore {get; set;} = 1;

    [Required, StringLength(500, MinimumLength = 3)]
    public string? Category {get; set;}
  
    public CorrectAnswer CorrectAnswer {get; set;}
    public ICollection<IncorrectAnswer> IncorrectAnswers {get; set;}

    internal Question()
    {
        QuestionText = default!;
        CorrectAnswer = default!;
        IncorrectAnswers = default!;
    }
    public Question(string text, CorrectAnswer answer, ICollection<IncorrectAnswer> answers)
    {
        QuestionText = text;
        CorrectAnswer = answer;
        IncorrectAnswers = answers;
    }
}