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
[Route("api/quiz")]
public class QuizController(QuizzesService quizService, UserManager<QuizGameUser> userManager) : ControllerBase
{
    private readonly QuizzesService _quizService = quizService;
    private readonly UserManager<QuizGameUser> _userManager = userManager;

    [HttpGet]
    public async Task<IResult> GetAllQuizzez(string? name, int? startIndex, int? pageSize) 
    {
        var user = await _userManager.GetUserAsync(User);
        var quizzes = await _quizService.GetAll(user!, name, startIndex, pageSize);
        return TypedResults.Ok(quizzes);
    }

    [HttpGet]
    [Route("/{id}")]
    public async Task<IResult> GetQuizById(int id)
    {
        var user = await _userManager.GetUserAsync(User);
        var quiz = await _quizService.GetById(user!,id);
        if(quiz is null)
            return TypedResults.BadRequest();
        return TypedResults.Ok(quiz);
    }

    [HttpPost]
    public async Task<IResult> InsertQuiz([FromBody] Quiz quiz, bool owned = true)
    {
        if(!ModelState.IsValid)
            return TypedResults.BadRequest();

        var user = await _userManager.GetUserAsync(User);
        if(await _quizService.AddQuiz(user!, owned, quiz))
            return TypedResults.Created($"/{quiz.Id}", quiz);
        
        return TypedResults.BadRequest();
    }

    [HttpPut]
    [Route("/{id}")]
    public async Task<IResult> ModifyQuiz(int id, [FromBody] Quiz quizToUpdate)
    {
        if(!ModelState.IsValid)
            return TypedResults.BadRequest();

        var user = await _userManager.GetUserAsync(User);
        if(!await _quizService.UpdateQuiz(id, quizToUpdate, user!))
            return TypedResults.BadRequest();
        return TypedResults.Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IResult> DeleteQuiz(int id)
    {
        var user = await _userManager.GetUserAsync(User);
        if(await _quizService.DeleteQuestion(id, user!))
            return TypedResults.Ok();
        
        return TypedResults.BadRequest();
    }
}