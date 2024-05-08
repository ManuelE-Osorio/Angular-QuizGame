using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using QuizGame.Data;
using QuizGame.Models;

namespace QuizGame;

public class QuizGame
{
    public static void Main()
    {
        var builder = WebApplication.CreateBuilder();

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddIdentityApiEndpoints<QuizGameUser>()
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<QuizGameContext>();

        builder.Services.AddDbContext<QuizGameContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("QuizGameConnectionString") ?? 
                throw new InvalidOperationException("Connection string 'QuizGame' not found.")));

        var app = builder.Build();

        using (var context = app.Services.CreateScope()
            .ServiceProvider.GetRequiredService<QuizGameContext>())
            {
                context.Database.EnsureDeleted();
                context.Database.EnsureCreated();
                // var serviceProvider = app.Services.CreateScope().ServiceProvider;
                // SeedData.SeedUser(serviceProvider).GetAwaiter().GetResult();
                // SeedData.SeedLogs(serviceProvider);
            }

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.Run();
    }
}




