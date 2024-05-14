
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace QuizGame.Models;

public class QuizGameUser : IdentityUser
{
    [Required, StringLength(100, MinimumLength = 3)]
    public string? Alias {get; set;}
    public ICollection<Quiz>? Quizzes {get; set;}
    public ICollection<Game>? AssignedGames {get; set;}
    public ICollection<Game>? OwnedGames {get; set;}
    public ICollection<Question>? OwnedQuestions {get; set;}
    public ICollection<GameScore>? GameResults {get; set;}
}