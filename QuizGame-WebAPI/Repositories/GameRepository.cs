using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using QuizGame.Data;
using QuizGame.Models;

namespace QuizGame.Repositories;

public class GamesRepository(QuizGameContext context): IQuizGameRepository<Game>
{
    private readonly QuizGameContext  _context = context;

    public async Task<bool> Create(Game model)
    {
        try
        {
            _context.Games.Add(model);
            await _context.SaveChangesAsync();
        }
        catch
        {
            return false; 
        }
        return true;
    }

    public async Task<bool> Delete(Game model)
    {
        try
        {
            _context.Games.Remove(model);
            await _context.SaveChangesAsync();
        }
        catch
        {
            return false;
        }
        return true;
    }

    public IEnumerable<Game> ReadAll(int? startIndex, int? pageSize)
    {
        return _context.Games
            .Include( p => p.Quiz)
            .Include( p => p.AssignedUsers)
            .Skip(startIndex ?? 0)
            .Take(pageSize ?? 5)
            .AsEnumerable();
    }

    public IEnumerable<Game> ReadAll(Expression<Func<Game,bool>> expression, int? startIndex, int? pageSize)
    {
        return _context.Games.Include( p => p.Quiz)
            .Include( p => p.AssignedUsers)
        
            .Where(expression)

            .Skip(startIndex ?? 0)
            .Take(pageSize ?? 5)
            .AsEnumerable();
    }

    public async Task<Game?> ReadById(int id)
    {
        return await _context.Games
            .Include( p => p.AssignedUsers)
            .Include( p => p.Quiz)
            .Include( p => p.Owner)
            .FirstOrDefaultAsync( p => p.Id == id);
    }

    public async Task<int> Count(Expression<Func<Game, bool>>? expression)
    {
        if(expression != null)
            return await _context.Games.Where(expression).CountAsync();
        return await _context.Games.CountAsync();
    }

    public async Task<bool> Update(Game model)
    {
        try
        {
            _context.Games.Update(model);
            await _context.SaveChangesAsync();
        }
        catch
        {
            return false;
        }
        return true;
    }
}