using System.ComponentModel.DataAnnotations;

namespace QuizGame.Models;

public class Game
{
    public int Id {get; set;}

    [Required, StringLength(100, MinimumLength = 3)]
    public string? Name {get; set;}

    [Required, Range(0, 100)]
    public int PassingScore {get; set;} = 0;

    [DateRange]
    [DataType(DataType.DateTime)]
    public DateTime? DueDate {get; set;}
    
    [Required]
    public Quiz? Quiz {get; set;}
    public ICollection<QuizGameUser>? AssignedUsers {get; set;}
    public ICollection<GameScore>? Scores {get; set;}
    public QuizGameUser? Owner {get; set;}

    private Game()
    {
        Name = default!;
        Quiz = default!;
    }
    public Game(string name, Quiz quiz)
    {
        Name = name;
        Quiz = quiz;
    }

    public Game(GameDto gameDto)
    {
        Id = gameDto.Id;
        Name = gameDto.Name;
        PassingScore = gameDto.PassingScore;
        DueDate = gameDto.DueDate;
    }

}

public class DateRangeAttribute : RangeAttribute
{
    public DateRangeAttribute()
    : base(typeof(DateTime), DateTime.Now.ToShortDateString(),     DateTime.MaxValue.ToShortDateString()) { } 
}