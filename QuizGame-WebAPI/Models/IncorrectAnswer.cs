namespace QuizGame.Models;

public class IncorrectAnswer : Answer 
{
    public IncorrectAnswer(string answerText)
    {
        AnswerText = answerText;
    }
}