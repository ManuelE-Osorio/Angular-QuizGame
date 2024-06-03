using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using QuizGame.Data;
using QuizGame.Models;
using QuizGame.Repositories;
using QuizGame.Services;

namespace QuizGame.Controllers;

[ApiController]
[ApiConventionType(typeof(DefaultApiConventions))]
[Route("api/quiz")]
[Authorize(Roles = "Admin")]
public class QuizzesController(QuizzesService quizService, UserManager<QuizGameUser> userManager) : ControllerBase
{
    private readonly QuizzesService _quizService = quizService;
    private readonly UserManager<QuizGameUser> _userManager = userManager;

    [HttpGet]
    public async Task<IResult> GetAllQuizzes(string? name, int? startIndex, int? pageSize) 
    {
        var user = await _userManager.GetUserAsync(User);
        var quizzes = await _quizService.GetAll(user!, name, startIndex, pageSize);
        return TypedResults.Ok(quizzes);
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IResult> GetQuizById(int id)
    {
        var user = await _userManager.GetUserAsync(User);
        QuizDto quiz;
        try
        {   
            quiz = await _quizService.GetById(user!,id);
        }
        catch(Exception ex)
        {
            return TypedResults.BadRequest(ex.Message);
        }

        return TypedResults.Ok(quiz);
    }

    [HttpPost]
    public async Task<IResult> InsertQuiz([FromBody] QuizDto quizDto, bool owned = true)
    {
        if(!ModelState.IsValid)
            return TypedResults.BadRequest();

        var user = await _userManager.GetUserAsync(User);
        var quiz = await _quizService.AddQuiz(user!, owned, quizDto);

        if(quiz != null)
            return TypedResults.Created($"/{quiz.Id}", quiz);
        
        return TypedResults.StatusCode(500);
    }

    [HttpPut]
    [Route("{id}")]
    public async Task<IResult> UpdateQuiz(int id, [FromBody] QuizDto quizToUpdate)
    {
        if(!ModelState.IsValid || quizToUpdate.Id != id)
            return TypedResults.BadRequest();

        var user = await _userManager.GetUserAsync(User);
        
        bool operationSuccesfull;
        try
        {
            operationSuccesfull = await _quizService.UpdateQuiz(quizToUpdate, user!);
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
    public async Task<IResult> DeleteQuiz(int id)
    {
        var user = await _userManager.GetUserAsync(User);
        
        bool operationSuccesfull;
        try
        {
            operationSuccesfull = await _quizService.DeleteQuiz(id, user!);
        }
        catch(Exception ex)
        {
            return TypedResults.BadRequest(ex.Message);
        }

        if(operationSuccesfull)
            return TypedResults.Ok();
        
        return TypedResults.StatusCode(500);
    }

    [HttpPut]
    [Route("{id}/questions")]
    public async Task<IResult> InsertQuizQuestions(int id, [FromBody] List<int> questionsId)
    {
        if(!ModelState.IsValid)
            return TypedResults.BadRequest();

        var user = await _userManager.GetUserAsync(User);

        bool operationSuccesfull;
        try
        {
            operationSuccesfull = await _quizService.AddQuestionsToQuiz(user!, id, questionsId);
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