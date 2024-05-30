using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace QuizGame.Models;

public class GameScoreDto
{
    public int Id {get; set;}

    [Required]
    public DateTime ResultDate {get; set;}
    
    [Range(0, 100)]
    public double Score {get; set;} = 0;
    
    public QuizGameUserDto? User {get; set;}

    [Required]
    public int GameId {get; set;}
    public string? GameName {get; set;}

    [JsonConstructor]
    public GameScoreDto() {}

    public GameScoreDto(GameScore gameScore)
    {
        Id = gameScore.Id;
        ResultDate = gameScore.ResultDate;
        Score = gameScore.Score;
        User = gameScore.User != null ? new QuizGameUserDto(gameScore.User) : null;
        GameId = gameScore.Game != null ? gameScore.Game.Id : 0;
        GameName = gameScore.Game?.Name;
    }
}