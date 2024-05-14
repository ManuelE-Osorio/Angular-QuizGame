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

    // [HttpGet]
    // [Route("/quiz/{id}")]
    // public async Task<IResult> GetQuestionsByQuiz(int id, int? startIndex, int? pageSize)
    // {

    // }

    // [HttpPost]
    // [Route("/{id}/quiz")]
    // public async Task<IResult> AssignToQuiz(int id)
    // {
    //     var user = await _userManager.GetUserAsync(User);
    //     return TypedResults.Ok();
    // }

    [HttpPost]
    public async Task<IResult> InsertQuestion([FromBody] Question question, bool owned = true)
    {
        if(!ModelState.IsValid)
            return TypedResults.BadRequest();

        var user = await _userManager.GetUserAsync(User);
        if(await _questionsService.AddQuestion(user!, owned, question))
            return TypedResults.Created($"/{question.Id}", question);
        
        return TypedResults.BadRequest();
    }

    [HttpPut("{id}")]
    public async Task<IResult> UpdateQuestion(int id, [FromBody] Question question)
    {
        if(!ModelState.IsValid)
            return TypedResults.BadRequest();

        var user = await _userManager.GetUserAsync(User);
        if( await _questionsService.UpdateQuestion(id, question, user!))
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