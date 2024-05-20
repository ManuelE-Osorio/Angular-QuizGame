using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace QuizGame.Models;

public class GameDto
{
    public int Id {get; set;}

    [Required, StringLength(100, MinimumLength = 3)]
    public string? Name {get; set;}

    [Required, Range(0, 100)]
    public int PassingScore {get; set;} = 0;

    [DateRange]
    [DataType(DataType.DateTime)]
    public DateTime? DueDate {get; set;}
    
    public int QuizId {get; set;}
    public string? QuizName {get; set;}
    public IEnumerable<QuizGameUserDto>? AssignedUsers {get; set;}
    public QuizGameUserDto? Owner {get; set;}

    [JsonConstructor]
    public GameDto() {}

    public GameDto(Game game)
    {
        Id = game.Id;
        Name = game.Name;
        PassingScore = game.PassingScore;
        DueDate = game.DueDate;
        QuizId = game.Quiz != null ? game.Quiz.Id : 0;
        QuizName = game.Quiz?.Name;
        AssignedUsers = game.AssignedUsers?.Select(p => new QuizGameUserDto(p));
        Owner = game.Owner != null ? new QuizGameUserDto(game.Owner) : null;
    }
}