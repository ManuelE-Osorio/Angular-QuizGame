using System.Diagnostics;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using QuizGame.Data;
using QuizGame.Models;
using QuizGame.Repositories;

namespace QuizGame.Services;

public class QuizzesService(IQuizGameRepository<Quiz> quizzesRepository)
{
    private readonly IQuizGameRepository<Quiz> _quizzesRepository = quizzesRepository;

    public async Task<PageData<QuizDto>> GetAll(QuizGameUser user, string? name, int? startIndex, int? pageSize)
    {
        Expression<Func<Quiz,bool>> expression = p => 
            (p.Owner == null || p.Owner == user) &&
            (name == null || p.Name.Equals(name, StringComparison.InvariantCultureIgnoreCase));

        var quizzes = _quizzesRepository
            .ReadAll(expression, startIndex, pageSize)
            .OrderBy( p => p.Name);
        
        var totalQuizzes = await _quizzesRepository.Count(expression);

        return new PageData<QuizDto>
        (
            quizzes.Select(p => new QuizDto(p)),
            totalQuizzes,
            startIndex,
            pageSize
        );
    }

    public async Task<QuizDto?> GetById(QuizGameUser user, int id)
    {
        var quiz = await _quizzesRepository.ReadById(id);
        if(quiz is null)
            return null;
        else if (quiz.Owner is not null && quiz.Owner != user)
            return null;

        return new QuizDto(quiz);
    }

    public async Task<bool> AddQuiz(QuizGameUser user, bool owned, Quiz quiz)
    {
        if(owned)
            quiz.Owner = user;

        //change from dto to question?
        
        if(await _quizzesRepository.Create(quiz))
            return true;
        
        return false;
    }

    public async Task<bool> UpdateQuiz(int id, Quiz quizToUpdate, QuizGameUser user)
    {
        var quiz = await _quizzesRepository.ReadById(id);
        if( quiz is null || id != quizToUpdate.Id)
            return false;
        
        if( quiz.Owner != null && quiz.Owner != user)
            return false;

        if( quiz.Games != null && quiz.Games.Count > 0)
            return false;

        //change from dto to question?

        if( await _quizzesRepository.Update(quiz))
            return true;

        return false;
    }

    public async Task<bool> DeleteQuestion(int id, QuizGameUser user)
    {
        var quiz = await _quizzesRepository.ReadById(id);
        if( quiz is null)
            return false;

        if( quiz.Owner != null && quiz.Owner != user)
            return false;

        if( quiz.Games != null && quiz.Games.Count > 0)
            return false;

        if(await _quizzesRepository.Delete(quiz))
            return true;

        return false;
    }
}

