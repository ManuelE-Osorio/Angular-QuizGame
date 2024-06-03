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
[Route("api/users")]
[Authorize(Roles = "Admin")]
public class UsersController(UserManager<QuizGameUser> userManager) : ControllerBase
{
    private readonly UserManager<QuizGameUser> _userManager = userManager;

    [HttpGet]
    public async Task<IResult> GetAllGames(int? startIndex, int? pageSize) 
    {
        var users = (await _userManager.GetUsersInRoleAsync("User"))
            .Skip(startIndex ?? 0)
            .Take(pageSize ?? 5);
        
        return TypedResults.Ok( new PageData<QuizGameUserDto>
        (
            users.Select(p => new QuizGameUserDto(p)),
            users.Count(),
            startIndex,
            pageSize
        ));
    }
}