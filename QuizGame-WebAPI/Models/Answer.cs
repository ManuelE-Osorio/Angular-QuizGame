using System.ComponentModel.DataAnnotations;

namespace QuizGame.Models;

public class Answer: IEquatable<Answer>
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

    public bool Equals(Answer? other)
    {
        if(other is null)
            return false;

        if( !AnswerText.Equals(other.AnswerText, StringComparison.InvariantCultureIgnoreCase))
            return false;

        if( AnswerImage != null && !AnswerImage.Equals(other.AnswerImage))
            return false;
        return true;
    }
}