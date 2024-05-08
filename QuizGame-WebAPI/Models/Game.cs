namespace QuizGame.Models;

public class Game
{
    public int Id {get; set;}
    public string Name {get; set;}
    public int PassingScore {get; set;}
    public DateTime DueDate {get; set;}
    public Quiz Quiz {get; set;}
    public IEnumerable<QuizGameUser>? AssignedUsers {get; set;}
    public QuizGameUser? Owner {get; set;}
    
    internal Game()
    {
        
    }
    public Game(string name, Quiz quiz)
    {
        Name = name;
        Quiz = quiz;
    }
}