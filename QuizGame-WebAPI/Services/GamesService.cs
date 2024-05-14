using System.Linq.Expressions;
using QuizGame.Models;
using QuizGame.Repositories;

namespace QuizGame.Services;

public class GamesService(IQuizGameRepository<Game> gamesRepository) : IQuizGameService
{
    private readonly IQuizGameRepository<Game> _gamesRepository = gamesRepository;
    public async Task<PageData<GameDto>> GetAll(QuizGameUser user, string? name, string? date, int? startIndex, int? pageSize)
    {
        var isValidDate = DateTime.TryParse( date, out DateTime dateResult);

        Expression<Func<Game,bool>> expression = p => 
            (p.Owner == null || p.Owner == user) &&
            (name == null || p.Name == name) &&
            (!isValidDate || p.DueDate == dateResult);

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
        if (game.Owner != null && game.Owner != user)
            throw new Exception("Quiz is not owned by the user making the request");

        return new GameDto(game);
    }

    public async Task<bool> AddGame(QuizGameUser user, bool owned, Game game)
    {
        if(owned)
            game.Owner = user;

        //change from dto to question?
        var operationSuccesfull = await _gamesRepository.Create(game);

        if(operationSuccesfull)
            return true;
        
        return false;
    }

    public async Task<bool> UpdateGame(Game gameToUpdate, QuizGameUser user)
    {
        var game = await _gamesRepository.ReadById(gameToUpdate.Id) ?? 
            throw new Exception("Game not found");

        if ( game.Owner != null && game.Owner != user)
            throw new Exception("Game is not owned by the user making the request");

        if( game.AssignedUsers != null && game.AssignedUsers.Count > 0)
            throw new Exception("Cannot delete game with assigned users.");

        //change from dto to question?

        if( await _gamesRepository.Update(game))
            return true;

        return false;
    }

    public async Task<bool> DeleteGame(int id, QuizGameUser user)
    {
        var game = await _gamesRepository.ReadById(id) ?? throw new Exception("Game not found");
        if ( game.Owner != null || game.Owner != user)
            throw new Exception("Game is not owned by the user making the request");

        if( game.AssignedUsers != null && game.AssignedUsers.Count > 0)
            throw new Exception("Cannot delete game with assigned users.");

        if(await _gamesRepository.Delete(game))
            return true;

        return false;
    }
}