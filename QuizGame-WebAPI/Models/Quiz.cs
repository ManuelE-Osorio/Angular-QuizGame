namespace QuizGame.Models;

public class Quiz
{
    public int Id {get; set;}
    public string Name {get; set;}
    public string? Description {get; set;}
    public IEnumerable<Question> Questions {get; set;}
    public IEnumerable<Game>? Games {get; set;}
    public QuizGameUser? Owner {get; set;}

    internal Quiz()
    {
        
    }
    public Quiz(string name, IEnumerable<Question> questions) 
    {
        Name = name;
        Questions = questions;
    }
}