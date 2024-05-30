using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using QuizGame.Data;
using QuizGame.Models;
using QuizGame.Repositories;
using QuizGame.Services;

namespace QuizGame;

public class QuizGame
{
    public static void Main()
    {
        var builder = WebApplication.CreateBuilder();

        builder.Services.AddAuthorization();
        // builder.Services.AddAuthentication();
        builder.Services.AddControllers();
        builder.Services.AddSwaggerGen();
        builder.Services.AddIdentityApiEndpoints<QuizGameUser>()
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<QuizGameContext>();
        builder.Services.AddEndpointsApiExplorer();

        builder.Services.AddDbContext<QuizGameContext>(options => 
        {
            options.UseSqlServer(builder.Configuration.GetConnectionString("QuizGameConnectionString") ?? 
                throw new InvalidOperationException("Connection string 'QuizGame' not found."));
            options.EnableSensitiveDataLogging();
        });

        builder.Services.Configure<IdentityOptions>( p => 
        {
            p.Password.RequireNonAlphanumeric = false;
        });

        builder.Services.AddScoped<IQuizGameRepository<Question>, QuestionsRepository>();
        builder.Services.AddScoped<QuestionsService>();
        builder.Services.AddScoped<IQuizGameRepository<Quiz>, QuizzesRepository>();
        builder.Services.AddScoped<QuizzesService>();
        builder.Services.AddScoped<IQuizGameRepository<Game>, GamesRepository>();
        builder.Services.AddScoped<GamesService>();
        builder.Services.AddScoped<IQuizGameRepository<GameScore>, GameScoreRepository>();
        builder.Services.AddScoped<GamesScoreService>();


        builder.Services.AddCors(options =>
        {
            options.AddPolicy(name: "AllowAnyOrigin",
                policy  =>
                {
                    policy.AllowAnyOrigin();
                    policy.AllowAnyMethod();
                    policy.AllowAnyHeader();
                });
        });

        var app = builder.Build();

        var services = app.Services.CreateScope().ServiceProvider;
        SeedData.Seed(services).GetAwaiter().GetResult();


        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        // app.UseAuthentication();
        // app.UseAuthorization();
        app.UseStaticFiles();
        app.MapControllers();
        app.MapIdentityApi<QuizGameUser>();
        app.MapSwagger();
        app.UseCors("AllowAnyOrigin");
        app.MapFallbackToFile("index.html");
        app.Run();
    }
}




