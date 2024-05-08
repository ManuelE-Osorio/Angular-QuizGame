
using Microsoft.AspNetCore.Identity;

namespace QuizGame.Models;

public class QuizGameUser : IdentityUser
{
    public string? Alias {get; set;}
    public IEnumerable<Quiz>? Quizzes {get; set;}
    public IEnumerable<Game>? AssignedGames {get; set;}
    public IEnumerable<Game>? OwnedGames {get; set;}
}