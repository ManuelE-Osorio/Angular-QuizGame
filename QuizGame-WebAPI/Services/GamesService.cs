using System.Linq.Expressions;
using Microsoft.AspNetCore.Identity;
using QuizGame.Models;
using QuizGame.Repositories;

namespace QuizGame.Services;

public class GamesService(
    IQuizGameRepository<Game> gamesRepository, 
    IQuizGameRepository<Quiz> quizzesRepository,
    UserManager<QuizGameUser> userManager) : IQuizGameService
{
    private readonly IQuizGameRepository<Game> _gamesRepository = gamesRepository;
    private readonly IQuizGameRepository<Quiz> _quizzesRepository = quizzesRepository;
    private readonly UserManager<QuizGameUser> _userManager = userManager;
    public async Task<PageData<GameDto>> GetAll(QuizGameUser user, string? name, string? date, int? startIndex, int? pageSize)
    {
        var isValidDate = DateTime.TryParse( date, out DateTime dateResult);

        Expression<Func<Game,bool>> expression = p => 
            (p.Owner == null || p.Owner == user) &&
            (name == null || 
            (p.Name != null && p.Name.Contains(name))) &&
            (!isValidDate || 
            (p.DueDate != null && p.DueDate.Value.Date == dateResult.Date));

        var games = _gamesRepository
            .ReadAll(expression, startIndex, pageSize)
            .OrderBy( p => p.DueDate);
            
        var totalGames = await _gamesRepository.Count(expression);

        return new PageData<GameDto>
        (
            games.Select(p => new GameDto(p)),
            totalGames,
            startIndex,
            pageSize
        );
    }

    public async Task<PageData<GameDto>> GetPendingGames(QuizGameUser user, int? startIndex, int? pageSize)
    {
        Expression<Func<Game,bool>> expression = p => 
            // p.AssignedUsers != null &&
            p.AssignedUsers!.Any(q => q == user) &&
            p.DueDate >= DateTime.Now &&
            (p.Scores == null || !p.Scores.Select(p => p.User).Contains(user));
            
        var games = _gamesRepository
            .ReadAll(expression, startIndex, pageSize)
            .OrderBy( p => p.DueDate);
            
        var totalGames = await _gamesRepository.Count(expression);

        return new PageData<GameDto>
        (
            games.Select(p => new GameDto(p)),
            totalGames,
            startIndex,
            pageSize
        );
    }

    public async Task<GameDto> GetById(QuizGameUser user, int id)
    {
        var game = await _gamesRepository.ReadById(id) ?? throw new Exception("Game not found");
        if (game.Owner != null && game.Owner.Id != user.Id)
            throw new Exception("Game is not owned by the user making the request");

        return new GameDto(game);
    }

    public async Task<GameDto?> AddGame(QuizGameUser user, bool owned, GameDto gameDto)
    {
        var game = new Game(gameDto);
        if(owned)
            game.Owner = user;

        var quiz = await _quizzesRepository.ReadById(gameDto.QuizId) ?? 
            throw new Exception ("Quiz Id does not exists");


        
        game.Quiz = quiz;
        var operationSuccesfull = await _gamesRepository.Create(game);

        if(operationSuccesfull)
            return new GameDto(game);
        
        return null;
    }

    public async Task<bool> AddUsersToGame(QuizGameUser user, int id, List<string> assignedUsers )
    {
        var game = await _gamesRepository.ReadById(id) ?? throw new Exception("Game not found");
        if (game.Owner != null && game.Owner.Id != user.Id)
            throw new Exception("Game is not owned by the user making the request");

        game.AssignedUsers = [];
        foreach(string usersId in assignedUsers)
        {
            var assignedUser = await _userManager.FindByIdAsync(usersId) ?? 
                throw new Exception("User Id does not exists");
            game.AssignedUsers.Add(assignedUser);
        }

        if(await _gamesRepository.Update(game))
            return true;
        
        return false;
    }

    public async Task<bool> UpdateGame(GameDto gameDto, QuizGameUser user)
    {
        var game = await _gamesRepository.ReadById(gameDto.Id) ?? 
            throw new Exception("Game not found");

        if ( game.Owner != null && game.Owner.Id != user.Id)
            throw new Exception("Game is not owned by the user making the request");

        game.Name = gameDto.Name;
        game.PassingScore = gameDto.PassingScore;
        game.DueDate = gameDto.DueDate;
        
        if( await _gamesRepository.Update(game))
            return true;

        return false;
    }

    public async Task<bool> DeleteGame(int id, QuizGameUser user)
    {
        var game = await _gamesRepository.ReadById(id) ?? throw new Exception("Game not found");

        if ( game.Owner != null && game.Owner.Id != user.Id)
            throw new Exception("Game is not owned by the user making the request");

        if(await _gamesRepository.Delete(game))
            return true;

        return false;
    }
}