using System.Net.Quic;
using Microsoft.AspNetCore.Authorization;
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
[Route("api/game")]
[Authorize]
public class GamesController(GamesService gamesService, UserManager<QuizGameUser> userManager) : ControllerBase
{
    private readonly GamesService _gamesService = gamesService;
    private readonly UserManager<QuizGameUser> _userManager = userManager;

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IResult> GetAllGames(string? name, string? date, int? startIndex, int? pageSize) 
    {
        var user = await _userManager.GetUserAsync(User);
        var games = await _gamesService.GetAll(user!, name, date, startIndex, pageSize);
        return TypedResults.Ok(games);
    }

    [HttpGet]
    [Route("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IResult> GetGameById(int id)
    {
        var user = await _userManager.GetUserAsync(User);
        GameDto game;
        try
        {   
            game = await _gamesService.GetById(user!,id);
        }
        catch(Exception ex)
        {
            return TypedResults.BadRequest(ex.Message);
        }

        return TypedResults.Ok(game);
    }

    [HttpGet]
    [Route("pending")]
    [Authorize(Roles = "User")]
    public async Task<IResult> GetPendingGames(int? startIndex, int? pageSize)
    {
        var user = await _userManager.GetUserAsync(User);
        var games = await _gamesService.GetPendingGames(user!, startIndex, pageSize);
        return TypedResults.Ok(games);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IResult> InsertGame([FromBody] GameDto gameDto, bool owned = true)
    {
        if(!ModelState.IsValid)
            return TypedResults.BadRequest();

        var user = await _userManager.GetUserAsync(User);
        var game = await _gamesService.AddGame( user!, owned, gameDto);

        if(game != null)
            return TypedResults.Created($"/{game.Id}", game);
        
        return TypedResults.StatusCode(500);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IResult> UpdateGame(int id, [FromBody] GameDto game)
    {
        if(!ModelState.IsValid || id != game.Id)
            return TypedResults.BadRequest();

        var user = await _userManager.GetUserAsync(User);
        
        bool operationSuccesfull;
        try
        {
            operationSuccesfull = await _gamesService.UpdateGame(game, user!);
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
        var user = await _userManager.GetUserAsync(User);

        bool operationSuccesfull;
        try
        {
            operationSuccesfull = await _gamesService.DeleteGame(id, user!);
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
    [Route("{id}/users")]
    [Authorize(Roles = "Admin")]
    public async Task<IResult> InserGameUsers(int id, [FromBody] List<string> assignedUsers)
    {
        if(!ModelState.IsValid)
            return TypedResults.BadRequest();

        var user = await _userManager.GetUserAsync(User);

        bool operationSuccesfull;
        try
        {
            operationSuccesfull = await _gamesService.AddUsersToGame(user!, id, assignedUsers);
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