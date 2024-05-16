using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace QuizGame.Models;

public class QuizGameUserDto
{
    public string? Id {get; set;}

    [Required, StringLength(100, MinimumLength = 3)]
    public string? Alias {get; set;}

    [JsonConstructor]
    public QuizGameUserDto() {}

    public QuizGameUserDto(QuizGameUser user)
    {
        Id = user.Id;
        Alias = user.Alias;
    }
}