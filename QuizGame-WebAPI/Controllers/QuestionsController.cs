using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizGame.Data;
using QuizGame.Models;
using QuizGame.Repositories;
using QuizGame.Services;

namespace QuizGame.Controllers;

[ApiController]
[ApiConventionType(typeof(DefaultApiConventions))]
[Route("api/questions")]
public class QuestionsController(QuestionsService questionsService, UserManager<QuizGameUser> userManager) : ControllerBase
{
    private readonly QuestionsService _questionsService = questionsService;
    private readonly UserManager<QuizGameUser> _userManager = userManager;

    [HttpGet]
    public async Task<IResult> GetAllQuestions(string? category, string? date, int? startIndex, int? pageSize) 
    {
        var user = await _userManager.GetUserAsync(User);
        var questions = _questionsService.GetAll(user!, category, date, startIndex, pageSize);

        return TypedResults.Ok(questions);  //dto?
    }

    [HttpPost]
    public async Task<IResult> InsertQuestion(Question question, bool owned = true)
    {
        if(!ModelState.IsValid)
            return TypedResults.BadRequest();

        var user = await _userManager.GetUserAsync(User);
        if(await _questionsService.AddQuestion(user!, owned, question))
            return TypedResults.Created($"/{question.Id}", question);
        
        return TypedResults.BadRequest();
    }

    [HttpPut("{id}")]
    public async Task<IResult> UpdateQuestion(Question question)
    {
        if(!ModelState.IsValid)
            return TypedResults.BadRequest();

        var user = await _userManager.GetUserAsync(User);
        if( await _questionsService.UpdateQuestion(question, user!))
            return TypedResults.Ok();

        return TypedResults.BadRequest();
    }


    [HttpDelete("{id}")]
    public async Task<IResult> DeleteQuestion(int id)
    {
        var user = await _userManager.GetUserAsync(User);
        if(await _questionsService.DeleteQuestion(id, user!))
            return TypedResults.Ok();
        
        return TypedResults.BadRequest();
    }
}