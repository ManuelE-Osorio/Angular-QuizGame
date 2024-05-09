using System.Linq.Expressions;

namespace QuizGame.Repositories;

public interface IQuizGameRepository<T> where T : class
{
    Task<bool> Create(T model);
    IEnumerable<T> ReadAll(int? startIndex, int? pageSize);
    IEnumerable<T> ReadAll(Expression<Func<T,bool>> expression, int? startIndex, int? pageSize);
    Task<int> Count(Expression<Func<T, bool>>? expression);
    Task<T?> ReadById(int id);
    Task<bool> Update(T model);
    Task<bool> Delete(T model);
}