using System.Text.Json.Serialization;

namespace QuizGame.Models;

public class QuestionForUserDto
{
    public int Id {get; set;}
    public string? QuestionText {get; set;}
    public string? QuestionImage {get; set;}
    public int SecondsTimeout {get; set;} = 0;
    public IEnumerable<Answer>? Answers {get; set;}

    [JsonConstructor]
    public QuestionForUserDto() {}
    public QuestionForUserDto(Question question)
    {
        Id = question.Id;
        QuestionText = question.QuestionText;
        QuestionImage = question.QuestionImage;
        SecondsTimeout = question.SecondsTimeout;
        Answers = question.IncorrectAnswers;
        Answers = question.CorrectAnswer != null ? Answers?.Append(question.CorrectAnswer) : Answers;

        var random = new Random();
        Answers = Answers?.OrderBy(order=>random.Next());
    } 
}