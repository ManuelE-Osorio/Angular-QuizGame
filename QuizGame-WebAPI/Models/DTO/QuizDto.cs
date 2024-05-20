using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace QuizGame.Models;

public class QuizDto
{    
    public int Id {get; set;}
    
    [Required, StringLength(100, MinimumLength = 3)]
    public string? Name {get; set;}
    public string? Description {get; set;}
    public IEnumerable<QuestionDto>? Questions {get; set;}
    public IEnumerable<int>? GamesId {get; set;}
    public IEnumerable<string?>? GamesName {get; set;}
    public QuizGameUserDto? Owner {get; set;}

    [JsonConstructor]
    public QuizDto() {}
    public QuizDto( Quiz quiz)
    {
        Id = quiz.Id;
        Name = quiz.Name;
        Description = quiz.Description;
        Owner = quiz.Owner != null ? new QuizGameUserDto( quiz.Owner) : null;
        Questions = quiz.Questions?.Select( p => new QuestionDto(p));
        GamesId = quiz.Games?.Select( p => p.Id);
        GamesName = quiz.Games?.Select( p => p.Name);
    }
}