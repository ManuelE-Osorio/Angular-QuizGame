using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using QuizGame.Models;

namespace QuizGame.Data;

public class QuizGameContext(DbContextOptions<QuizGameContext> options) : IdentityDbContext<QuizGameUser, IdentityRole, string>(options)
{
    public DbSet<Game> Games {get; set;}
    public DbSet<Question> Questions {get; set;}
    public DbSet<Quiz> Quizzes {get; set;}
    public DbSet<CorrectAnswer> Answers {get; set;}
    public DbSet<IncorrectAnswer> IncorrectAnswers {get; set;}
    public DbSet<GameScore> Scores {get; set;}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Quiz>( p => 
        {
            p.Property( p => p.Name).IsRequired();

            p.HasMany( p => p.Questions)
                .WithMany( p => p.AssignedQuizzes);

            p.HasOne( p => p.Owner)
                .WithMany( p => p.Quizzes)
                .IsRequired(false);
        });

        modelBuilder.Entity<Game>( p => 
        {
            p.HasOne( p => p.Quiz)
                .WithMany( p => p.Games)
                .IsRequired(true);

            p.HasOne( p => p.Owner)
                .WithMany( p => p.OwnedGames)
                .IsRequired(false);

            p.HasMany( p => p.AssignedUsers)
                .WithMany( p => p.AssignedGames);
        });

        modelBuilder.Entity<Question>( p => 
        {
            p.Property( p => p.QuestionText)
                .IsRequired();
                
            p.HasOne( p => p.CorrectAnswer)
                .WithOne()
                .HasForeignKey<CorrectAnswer>( "QuestionId")
                .IsRequired(true);
            
            p.HasMany( p => p.IncorrectAnswers)
                .WithOne()
                .IsRequired(true);

            p.HasOne( p => p.Owner)
                .WithMany( p => p.OwnedQuestions)
                .IsRequired(false);
        });

        modelBuilder.Entity<GameScore>( p => 
        {
            p.HasOne( p => p.User)
                .WithMany( p => p.GameResults)
                .IsRequired(true);

            p.HasOne( p => p.Game)
                .WithMany( p => p.Scores)
                .IsRequired(true);
        });
    }
}