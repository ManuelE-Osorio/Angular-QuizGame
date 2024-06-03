using System.Reflection.Metadata;
using Microsoft.AspNetCore.Identity;
using QuizGame.Data;

namespace QuizGame.Models;

public class SeedData
{
    private static readonly ICollection<Question> MathQuestions =  [new Question 
        ( 
            "How much is 2x2?", 
            new CorrectAnswer("4"), 
            [new IncorrectAnswer("2"), new IncorrectAnswer("6"), new IncorrectAnswer("8")]
        ) {Category = "Basic Math", SecondsTimeout = 5, CreatedAt = DateTime.Now},
        new Question
        (
            "How much is 4x4?",
            new CorrectAnswer("16"),
            [new IncorrectAnswer("2"), new IncorrectAnswer("8"), new IncorrectAnswer("12")]
        ) {Category = "Basic Math", SecondsTimeout = 5, CreatedAt = DateTime.Now},
        new Question
        (
            "How much is 3x3?",
            new CorrectAnswer("9"),
            [new IncorrectAnswer("3"), new IncorrectAnswer("10"), new IncorrectAnswer("6")]
        ) {Category = "Basic Math", SecondsTimeout = 5, CreatedAt = DateTime.Now}, 
        new Question
        (
            "How much is 5x5?",
            new CorrectAnswer("25"),
            [new IncorrectAnswer("5"), new IncorrectAnswer("30"), new IncorrectAnswer("15")]
        ) {Category = "Basic Math", SecondsTimeout = 5, CreatedAt = DateTime.Now}];
    private static readonly ICollection<Question> AdvancedMathQuestions =  [new Question 
        ( 
            "How much is 7x20?", 
            new CorrectAnswer("140"), 
            [new IncorrectAnswer("70"), new IncorrectAnswer("200"), new IncorrectAnswer("120")]
        ) {Category = "Advanced Math", SecondsTimeout = 7, RelativeScore = 2, CreatedAt = DateTime.Now.AddDays(-1)},
        new Question
        (
            "How much is 13x5?",
            new CorrectAnswer("65"),
            [new IncorrectAnswer("55"), new IncorrectAnswer("75"), new IncorrectAnswer("60")]
        ) {Category = "Advanced Math", SecondsTimeout = 7, RelativeScore = 2, CreatedAt = DateTime.Now.AddDays(-1)},
        new Question
        (
            "How much is 8x12?",
            new CorrectAnswer("96"),
            [new IncorrectAnswer("80"), new IncorrectAnswer("88"), new IncorrectAnswer("66")]
        ) {Category = "Advanced Math", SecondsTimeout = 7, RelativeScore = 2, CreatedAt = DateTime.Now.AddDays(-1)},
        new Question
        (
            "How much is 9x13?",
            new CorrectAnswer("117"),
            [new IncorrectAnswer("90"), new IncorrectAnswer("127"), new IncorrectAnswer("107")]
        ) {Category = "Advanced Math", SecondsTimeout = 7, RelativeScore = 2, CreatedAt = DateTime.Now.AddDays(-1)}];  
    private static readonly ICollection<Question> CapitalQuestions = [new Question 
        ( 
            "What is the capital of Spain?", 
            new CorrectAnswer("Madrid"), 
            [new IncorrectAnswer("Paris"), new IncorrectAnswer("Buenos Aires"), new IncorrectAnswer("Beijing")]
        ) {Category = "Capitals", SecondsTimeout = 5, CreatedAt = DateTime.Now.AddDays(-2)},
        new Question
        (
            "What is the capital of Japan?",
            new CorrectAnswer("Tokyo"),
            [new IncorrectAnswer("Beijing"), new IncorrectAnswer("Berlin"), new IncorrectAnswer("Paris")]
        ) {Category = "Capitals", SecondsTimeout = 5, CreatedAt = DateTime.Now.AddDays(-2)},
        new Question
        (
            "What is the capital of Norway?",
            new CorrectAnswer("Oslo"),
            [new IncorrectAnswer("Tokyo"), new IncorrectAnswer("Madrid"), new IncorrectAnswer("Amsterdam")]
        ) {Category = "Capitals", SecondsTimeout = 5, CreatedAt = DateTime.Now.AddDays(-2)},
        new Question
        (
            "What is the capital of Argentina?",
            new CorrectAnswer("Buenos Aires"),
            [new IncorrectAnswer("Santiago"), new IncorrectAnswer("Caracas"), new IncorrectAnswer("Bogotá")]
        ) {Category = "Capitals", SecondsTimeout = 5, CreatedAt = DateTime.Now.AddDays(-2)}];

    private static readonly Quiz MathQuiz = new("Basic Math Quiz", [.. MathQuestions]) {Description = "Basic Math Quiz"};
    private static readonly Quiz CapitalQuiz = new("Capital cities Quiz", [.. CapitalQuestions]) {Description = "Capital cities Quiz"};
    private static readonly Quiz AdvancedMathQuiz = new("Advanced Math Quiz", [..MathQuestions, ..AdvancedMathQuestions]) {Description = "Advanced Math Quiz"};
    
    private static readonly Game MathGame = new("Basic Math Game", MathQuiz) 
    {
        DueDate = DateTime.Now.AddDays(1), 
        PassingScore = 70
    };
    private static readonly Game CapitalGame = new("Capital cities Game", CapitalQuiz) 
    {
        DueDate = DateTime.Now.AddDays(1), 
        PassingScore = 60
    };
    private static readonly Game AdvancedMathGame = new("Advanced Math Game", AdvancedMathQuiz) 
    {
        DueDate = DateTime.Now.AddDays(1), 
        PassingScore = 50
    };
    
    public static async Task<bool> Seed(IServiceProvider services)
    {
        using var context = services.GetRequiredService<QuizGameContext>();
        // context.Database.EnsureDeleted();
        context.Database.EnsureCreated();
        if(context.Questions.Any() || context.Quizzes.Any() || context.Users.Any() || context.Games.Any())
            return false;

        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        await roleManager.CreateAsync(new IdentityRole("Admin"));
        await roleManager.CreateAsync(new IdentityRole("User"));

        var userManager = services.GetRequiredService<UserManager<QuizGameUser>>();
        var userStore = services.GetRequiredService<IUserStore<QuizGameUser>>();
        var emailStore = (IUserEmailStore<QuizGameUser>)userStore;
        
        var email = "admin@tcsa.com";
        var admin = new QuizGameUser() {Alias = "Admin"};
        await userStore.SetUserNameAsync(admin, email, CancellationToken.None);
        await emailStore.SetEmailAsync(admin, email, CancellationToken.None);
        await userManager.CreateAsync(admin, "Admin1234");
        await userManager.AddToRoleAsync(admin, "Admin");
        await userManager.AddToRoleAsync(admin, "User");

        var user1 = new QuizGameUser() {Alias = "User1"};;        
        email = "user1@tcsa.com";
        await userStore.SetUserNameAsync(user1, email, CancellationToken.None);
        await emailStore.SetEmailAsync(user1, email, CancellationToken.None);
        await userManager.CreateAsync(user1, "User1234");
        await userManager.AddToRoleAsync(user1, "User");

        var user2 = new QuizGameUser() {Alias = "User2"};;        
        email = "user2@tcsa.com";
        await userStore.SetUserNameAsync(user2, email, CancellationToken.None);
        await emailStore.SetEmailAsync(user2, email, CancellationToken.None);
        await userManager.CreateAsync(user2, "User1234");
        await userManager.AddToRoleAsync(user2, "User");

        context.SaveChanges();        

        foreach(var question in MathQuestions)
        {
            question.Owner = admin;
        }

        foreach(var question in CapitalQuestions)
        {
            question.Owner = admin;
        }

        context.Questions.AddRange([..MathQuestions, ..AdvancedMathQuestions, ..CapitalQuestions]);
        context.Quizzes.AddRange( [MathQuiz, CapitalQuiz, AdvancedMathQuiz]);
        context.Games.AddRange( [MathGame, CapitalGame, AdvancedMathGame]);

        context.SaveChanges();

        admin.OwnedGames = [MathGame, CapitalGame, AdvancedMathGame];
        admin.Quizzes = [MathQuiz, CapitalQuiz, AdvancedMathQuiz];

        user1.AssignedGames = [MathGame, CapitalGame, AdvancedMathGame];
        user2.AssignedGames = [MathGame, CapitalGame, AdvancedMathGame];

        context.Users.UpdateRange([admin, user1, user2]);
        context.SaveChanges();

        return true;
    }
}