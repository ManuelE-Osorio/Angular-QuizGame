using System.ComponentModel.DataAnnotations;

namespace QuizGame.Models;

public class Answer
{
    public int Id {get; set;}

    [Required, StringLength(500, MinimumLength = 1)]
    public string AnswerText {get; set;}
    public string? AnswerImage {get; set;}
    private Answer() 
    {
        AnswerText = default!;
    }
    public Answer(string answerText)
    {
        AnswerText = answerText;
    }
}