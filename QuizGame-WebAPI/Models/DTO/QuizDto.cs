using System.ComponentModel.DataAnnotations;

namespace QuizGame.Models;

public class QuizDto
{    
    public int Id {get; set;}
    
    [Required, StringLength(100, MinimumLength = 3)]
    public string Name {get; set;}
    public string? Description {get; set;}
    public ICollection<Question> Questions {get; set;}
    public ICollection<Game>? Games {get; set;}
    public QuizGameUserDto? Owner {get; set;}

    public QuizDto( Quiz quiz)
    {
        Id = quiz.Id;
        Name = quiz.Name;
        Description = quiz.Description;
        Owner = quiz.Owner != null ? new QuizGameUserDto( quiz.Owner) : null;
    }
}