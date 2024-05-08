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
    public DbSet<Answer> Answers {get; set;}
    // public DbSet<Answer> IncorrectAnswers {get; set;}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // modelBuilder.Entity<QuizGameUser>( p => 
        // {
        //     p.HasKey( p => p.Id);
                
        //     p.HasMany( p => p.Quizzes)
        //         .WithOne( p => p.Owner)
        //         .IsRequired(false);
            
        //     p.HasMany( p => p.OwnedGames)
        //         .WithOne( p => p.Owner)
        //         .IsRequired(false);
            
        //     p.HasMany( p => p.AssignedGames)
        //         .WithMany( p => p.AssignedUsers);
        // });

        modelBuilder.Entity<Quiz>( p => 
        {
            p.HasMany( p => p.Questions)
                .WithMany();

            p.HasOne( p => p.Owner)
                .WithMany( p => p.Quizzes)
                .IsRequired(false);
        });

        modelBuilder.Entity<Game>( p => 
        {
            p.HasOne( p => p.Quiz)
                .WithMany( p => p.Games)
                .IsRequired(false);

            p.HasOne( p => p.Owner)
                .WithMany( p => p.OwnedGames)
                .IsRequired(false);

            p.HasMany( p => p.AssignedUsers)
                .WithMany( p => p.AssignedGames);
        });

        modelBuilder.Entity<Question>( p => 
        {
            p.HasOne( p => p.CorrectAnswer)
                .WithOne()
                .IsRequired(true)
                .HasForeignKey<Question>( p => p.Id)
                .OnDelete(DeleteBehavior.NoAction);
            
            p.HasMany( p => p.IncorrectAnswers)
                .WithMany();
        });
    }
}