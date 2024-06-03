using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using QuizGame.Models;
using QuizGame.Services;

namespace QuizGame.Controllers;

[ApiController]
[ApiConventionType(typeof(DefaultApiConventions))]
[Route("api/scores")]
public class ScoresController(GamesScoreService gamesScoreService, UserManager<QuizGameUser> userManager) : ControllerBase
{
    private readonly GamesScoreService _gamesScoreService = gamesScoreService;
    private readonly UserManager<QuizGameUser> _userManager = userManager;

    [HttpGet]
    [Authorize(Roles = "Admin, User")]
    public async Task<IResult> GetAllScores(string? game, string? date, int? startIndex, int? pageSize) 
    {
        var user = await _userManager.GetUserAsync(User);
        var games = await _gamesScoreService.GetAll(user!, game, date, startIndex, pageSize);
        return TypedResults.Ok(games);
    }

    [HttpGet]
    [Route("{id}")]
    [Authorize(Roles = "Admin, User")]
    public async Task<IResult> GetScoreById(int id)
    {
        var user = await _userManager.GetUserAsync(User);
        GameScoreDto score;
        try
        {   
            score = await _gamesScoreService.GetById(user!,id);
        }
        catch(Exception ex)
        {
            return TypedResults.BadRequest(ex.Message);
        }

        return TypedResults.Ok(score);
    }

    [HttpPost]
    [Authorize(Roles = "Admin, User")]
    public async Task<IResult> InsertScore(int gameId, [FromBody] List<CorrectAnswer> answers)
    {
        if(!ModelState.IsValid)
            return TypedResults.BadRequest();

        var user = await _userManager.GetUserAsync(User);
        var score = await _gamesScoreService.AddScore( user!, gameId, answers);

        if(score != null)
            return TypedResults.Created($"/{score.Id}", score);
        
        return TypedResults.StatusCode(500);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IResult> UpdateScore(int id, [FromBody] GameScoreDto score)
    {
        if(!ModelState.IsValid || id != score.Id)
            return TypedResults.BadRequest();
        
        bool operationSuccesfull;
        try
        {
            operationSuccesfull = await _gamesScoreService.UpdateScore(score);
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
    [Authorize(Roles = "Admin")]
    public async Task<IResult> DeleteQuestion(int id)
    {
        bool operationSuccesfull;
        try
        {
            operationSuccesfull = await _gamesScoreService.DeleteScore(id);
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