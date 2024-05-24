using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace QuizGame.Models;

public class QuestionDto
{
    public int Id {get; set;}

    [Required, StringLength(500, MinimumLength = 3)]
    public string? QuestionText {get; set;}
    public string? QuestionImage {get; set;}
    public int SecondsTimeout {get; set;} = 0;
    public double RelativeScore {get; set;} = 1;

    [Required, StringLength(500, MinimumLength = 3)]
    public string? Category {get; set;}
    public DateTime? CreatedAt {get; set;}
    
    [Required]
    public CorrectAnswer? CorrectAnswer {get; set;}

    [Required]
    public ICollection<IncorrectAnswer>? IncorrectAnswers {get; set;}
    public QuizGameUserDto? Owner {get; set;}
    public IEnumerable<string>? AssignedQuizzes {get; set;}

    [JsonConstructor]
    public QuestionDto() {}
    public QuestionDto(Question question)
    {
        Id = question.Id;
        QuestionText = question.QuestionText;
        QuestionImage = question.QuestionImage;
        SecondsTimeout = question.SecondsTimeout;
        RelativeScore = question.RelativeScore;
        Category = question.Category;
        CreatedAt = question.CreatedAt;
        CorrectAnswer = question.CorrectAnswer;
        IncorrectAnswers = question.IncorrectAnswers;
        Owner = question.Owner != null ? new QuizGameUserDto(question.Owner) : null ;
        AssignedQuizzes = question.AssignedQuizzes?.Select( p => p.Name!);
    } 
}