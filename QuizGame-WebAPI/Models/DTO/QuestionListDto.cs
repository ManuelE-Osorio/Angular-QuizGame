using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace QuizGame.Models;

public class QuestionListDto
{
    public int Id {get; set;}

    [Required, StringLength(500, MinimumLength = 3)]
    public string? QuestionText {get; set;}

    [Required, StringLength(500, MinimumLength = 3)]
    public string? Category {get; set;}
    public DateTime? CreatedAt {get; set;}
    
    [Required]
    public CorrectAnswer? CorrectAnswer {get; set;}

    [JsonConstructor]
    public QuestionListDto() {}
    public QuestionListDto(Question question)
    {
        Id = question.Id;
        QuestionText = question.QuestionText;
        Category = question.Category;
        CreatedAt = question.CreatedAt;
        CorrectAnswer = question.CorrectAnswer;
    } 
}