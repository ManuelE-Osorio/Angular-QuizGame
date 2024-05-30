namespace QuizGame.Models;

public class GameScore
{
    public int Id {get; set;}
    public DateTime ResultDate {get; set;}
    public double Score {get; set;}
    
    public QuizGameUser? User {get; set;}
    public Game? Game {get; set;}

    private GameScore()
    {
        User = default!;
        Game = default!;
    }

    public GameScore(QuizGameUser user, Game game)
    {
        User = user;
        Game = game;
    }

    public GameScore(GameScoreDto gameScoreDto)
    {
        Id = gameScoreDto.Id;
        ResultDate = gameScoreDto.ResultDate;
        Score = gameScoreDto.Score;
    }
}