using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using QuizGame.Models;

namespace QuizGame.Controllers;

[ApiController]
[ApiConventionType(typeof(DefaultApiConventions))]
[Authorize]
public class QuizGameController( SignInManager<QuizGameUser> signInManager) : Controller
{
    private readonly SignInManager<QuizGameUser> _signInManager = signInManager;

    [HttpPost]
    [Route("/logout")]
    public async Task<IResult> LogOut( [FromBody] object empty)
    {
        if (empty is not null)
        {
            await _signInManager.SignOutAsync();
            return TypedResults.Ok();
        }
        return TypedResults.NotFound();
    }

    [HttpGet]
    [Route("/adminrole")]
    public IResult UserIsAdmin ()
    {
        return TypedResults.Ok( User.IsInRole("Admin"));
    }

    [HttpGet]
    [Route("/userrole")]
    public IResult IsUser ()
    {
        return TypedResults.Ok( User.IsInRole("User"));
    }
}