using System.ComponentModel.DataAnnotations;

namespace QuizGame.Models;

public class Quiz
{
    public int Id {get; set;}
    
    [Required, StringLength(100, MinimumLength = 3)]
    public string? Name {get; set;}
    public string? Description {get; set;}
    public ICollection<Question>? Questions {get; set;}
    public ICollection<Game>? Games {get; set;}
    public QuizGameUser? Owner {get; set;}

    private Quiz()
    {
        Name = default!;
        Questions = default!;
    }
    public Quiz(string name, ICollection<Question> questions) 
    {
        Name = name;
        Questions = questions;
    }

    public Quiz(QuizDto quizDto)
    {
        Id = quizDto.Id;
        Name = quizDto.Name;
        Description = quizDto.Description;
    }
}