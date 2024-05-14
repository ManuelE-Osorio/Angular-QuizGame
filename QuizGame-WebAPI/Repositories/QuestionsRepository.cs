using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using QuizGame.Data;
using QuizGame.Models;

namespace QuizGame.Repositories;

public class QuestionsRepository(QuizGameContext context): IQuizGameRepository<Question>
{
    private readonly QuizGameContext  _context = context;

    public async Task<bool> Create(Question model)
    {
        try
        {
            _context.Questions.Add(model);
            await _context.SaveChangesAsync();
        }
        catch
        {
            return false;  //log error?
        }
        return true;
    }

    public async Task<bool> Delete(Question model)
    {
        try
        {
            _context.Questions.Remove(model);
            await _context.SaveChangesAsync();
        }
        catch
        {
            return false;
        }
        return true;
    }

    public IEnumerable<Question> ReadAll(int? startIndex, int? pageSize)
    {
        return _context.Questions
            .Include(p => p.CorrectAnswer)
            .Include(p => p.IncorrectAnswers)
            .AsEnumerable()
            .Skip(startIndex ?? 0)
            .Take(pageSize ?? 5);
    }

    public async Task<Question?> ReadById(int id)
    {
        return await _context.Questions.FindAsync(id);
    }

    public IEnumerable<Question> ReadAll(Expression<Func<Question,bool>> expression, int? startIndex, int? pageSize)
    {
        return _context.Questions.Where(expression)
            .Include( p => p.CorrectAnswer)
            .Include( p => p.IncorrectAnswers)
            .AsEnumerable()
            .Skip(startIndex ?? 0)
            .Take(pageSize ?? 5);
    }

    public async Task<int> Count(Expression<Func<Question, bool>>? expression)
    {
        if(expression != null)
            return await _context.Questions.Where(expression).CountAsync();
        return await _context.Questions.CountAsync();
    }
    public async Task<bool> Update(Question model)
    {
        try
        {
            _context.Questions.Update(model);
            await _context.SaveChangesAsync();
        }
        catch
        {
            return false;
        }
        return true;
    }
}