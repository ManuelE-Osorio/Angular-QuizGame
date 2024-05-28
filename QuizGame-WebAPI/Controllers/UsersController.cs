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
[Route("api/users")]
public class UsersController(UsersService userService, UserManager<QuizGameUser> userManager) : ControllerBase
{
    private readonly UsersService _userService = userService;
    private readonly UserManager<QuizGameUser> _userManager = userManager;

    [HttpGet]
    public async Task<IResult> GetAllGames(string? name, string? date, int? startIndex, int? pageSize) 
    {
        var user = await _userManager.GetUserAsync(User);

        await _userManager
        var games = await _gamesService.GetAll(user!, name, date, startIndex, pageSize);
        return TypedResults.Ok(games);
    }
}