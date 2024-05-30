using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using QuizGame.Data;
using QuizGame.Models;

namespace QuizGame.Repositories;

public class QuizzesRepository(QuizGameContext context): IQuizGameRepository<Quiz>
{
    private readonly QuizGameContext  _context = context;

    public async Task<bool> Create(Quiz model)
    {
        try
        {
            _context.Quizzes.Add(model);
            await _context.SaveChangesAsync();
        }
        catch
        {
            return false;  
        }
        return true;
    }

    public IEnumerable<Quiz> ReadAll(int? startIndex, int? pageSize)
    {
        return _context.Quizzes
            .Skip(startIndex ?? 0)
            .Take(pageSize ?? 5)
            .AsEnumerable();
    }

    public async Task<Quiz?> ReadById(int id)
    {
        return await _context.Quizzes
            .Include( p => p.Games)
            .Include( p => p.Owner)
            .Include(p => p.Questions)
            .FirstOrDefaultAsync( p => p.Id == id);
    }

    public IEnumerable<Quiz> ReadAll(Expression<Func<Quiz,bool>> expression, int? startIndex, int? pageSize)
    {
        return _context.Quizzes.Where(expression)
            .Skip(startIndex ?? 0)
            .Take(pageSize ?? 5)
            .AsEnumerable();

    }

    public async Task<int> Count(Expression<Func<Quiz, bool>>? expression)
    {
        if(expression != null)
            return await _context.Quizzes.Where(expression).CountAsync();
        return await _context.Questions.CountAsync();
    }

    public async Task<bool> Update(Quiz model)
    {
        try
        {
            _context.Quizzes.Update(model);
            await _context.SaveChangesAsync();
        }
        catch
        {
            return false;
        }
        return true;
    }

    public async Task<bool> Delete(Quiz model)
    {
        try
        {
            _context.Quizzes.Remove(model);
            await _context.SaveChangesAsync();
        }
        catch
        {
            return false;
        }
        return true;
    }
}