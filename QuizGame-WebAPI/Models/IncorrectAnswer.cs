namespace QuizGame.Models;

public class IncorrectAnswer : Answer
{
    public IEnumerable<Question>? Questions {get; set;}
}