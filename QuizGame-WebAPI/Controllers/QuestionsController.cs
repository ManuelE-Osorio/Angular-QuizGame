using System.Net.Quic;
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
        var questions = await _questionsService.GetAll(user!, category, date, startIndex, pageSize);
        return TypedResults.Ok(questions);
    }

    [HttpPost]
    public async Task<IResult> InsertQuestion([FromBody] Question question, bool owned = true)
    {
        if(!ModelState.IsValid)
            return TypedResults.BadRequest();

        var user = await _userManager.GetUserAsync(User);
        if(await _questionsService.AddQuestion(user!, owned, question))
            return TypedResults.Created($"/{question.Id}", question);
        
        return TypedResults.StatusCode(500);
    }

    [HttpPut("{id}")]
    public async Task<IResult> UpdateQuestion(int id, [FromBody] Question question)
    {
        if(!ModelState.IsValid || id != question.Id)
            return TypedResults.BadRequest(ModelState);

        var user = await _userManager.GetUserAsync(User);
        
        bool operationSuccesfull;
        try
        {
            operationSuccesfull = await _questionsService.UpdateQuestion(question, user!);
        }
        catch(Exception ex)
        {
            return TypedResults.BadRequest(ex.Message);
        }

        if(operationSuccesfull)
            return TypedResults.Ok();

        return TypedResults.StatusCode(500);
    }

    [HttpDelete("{id}")]
    public async Task<IResult> DeleteQuestion(int id)
    {
        var user = await _userManager.GetUserAsync(User);

        bool operationSuccesfull;
        try
        {
            operationSuccesfull = await _questionsService.DeleteQuestion(id, user!);
        }
        catch(Exception ex)
        {
            return TypedResults.BadRequest(ex.Message);
        }

        if(operationSuccesfull)
            return TypedResults.Ok();
        
        return TypedResults.StatusCode(500);
    }
}