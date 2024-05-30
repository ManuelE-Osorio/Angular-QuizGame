using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using QuizGame.Data;
using QuizGame.Models;

namespace QuizGame.Repositories;

public class GameScoreRepository(QuizGameContext context): IQuizGameRepository<GameScore>
{
    private readonly QuizGameContext  _context = context;

    public async Task<bool> Create(GameScore model)
    {
        try
        {
            _context.Scores.Add(model);
            await _context.SaveChangesAsync();
        }
        catch
        {
            return false; 
        }
        return true;
    }

    public async Task<bool> Delete(GameScore model)
    {
        try
        {
            _context.Scores.Remove(model);
            await _context.SaveChangesAsync();
        }
        catch
        {
            return false;
        }
        return true;
    }

    public IEnumerable<GameScore> ReadAll(int? startIndex, int? pageSize)
    {
        return _context.Scores
            .Include( p => p.Game)
            .Include( p => p.User)
            .Skip(startIndex ?? 0)
            .Take(pageSize ?? 5)
            .AsEnumerable();
    }

    public IEnumerable<GameScore> ReadAll(Expression<Func<GameScore,bool>> expression, int? startIndex, int? pageSize)
    {
        return _context.Scores.Where(expression)
            .Include( p => p.Game)
            .Include( p => p.User)
            .Skip(startIndex ?? 0)
            .Take(pageSize ?? 5)
            .AsEnumerable();
    }

    public async Task<GameScore?> ReadById(int id)
    {
        return await _context.Scores
            .Include( p => p.Game)
            .Include( p => p.User)
            .FirstOrDefaultAsync( p => p.Id == id);
    }

    public async Task<int> Count(Expression<Func<GameScore, bool>>? expression)
    {
        if(expression != null)
            return await _context.Scores.Where(expression).CountAsync();
        return await _context.Scores.CountAsync();
    }

    public async Task<bool> Update(GameScore model)
    {
        try
        {
            _context.Scores.Update(model);
            await _context.SaveChangesAsync();
        }
        catch
        {
            return false;
        }
        return true;
    }
}