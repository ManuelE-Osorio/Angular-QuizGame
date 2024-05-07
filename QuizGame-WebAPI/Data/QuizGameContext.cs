using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace QuizGame.Data;

public class QuizGameContext(DbContextOptions<QuizGameContext> options) : IdentityDbContext<IdentityUser, IdentityRole, string>(options)
{
    
}