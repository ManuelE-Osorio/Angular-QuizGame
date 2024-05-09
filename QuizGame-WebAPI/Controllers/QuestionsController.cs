using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizGame.Data;
using QuizGame.Models;

namespace QuizGame.Controllers;

[ApiController]
[ApiConventionType(typeof(DefaultApiConventions))]
[Route("api/questions")]
public class QuestionsController(QuizGameContext context, UserManager<QuizGameUser> userManager) : ControllerBase
{
    private readonly QuizGameContext _context = context;
    private readonly UserManager<QuizGameUser> _userManager = userManager;

    public async Task<IResult> GetAllQuestions(string? category) 
    {
        var user = _userManager.GetUserId(User);
        var questions = _context.Questions
            .Where( p => p.Owner == null || p.Owner.Id == user);

        if(category is not null)
            questions = questions.Where( p => p.Category == category);

        return TypedResults.Ok(await questions.ToListAsync());  //dto?
    }

    public async Task<IResult> InsertQuestion(Question question, bool owned = true)
    {
        if(!ModelState.IsValid)
            return TypedResults.BadRequest();

        
        var user = await _userManager.GetUserAsync(User);
        if(owned == true)
            question.Owner = user;

        _context.Questions.Add(question);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch
        {
            //errorhandler
        }
        return TypedResults.Created($"/{question.Id}", question);
    }
}