using System.Diagnostics;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using QuizGame.Data;
using QuizGame.Models;
using QuizGame.Repositories;

namespace QuizGame.Services;

public interface IQuizGameService {}

public class QuestionsService(IQuizGameRepository<Question> questionsRepository) : IQuizGameService
{
    private readonly IQuizGameRepository<Question> _questionsRepository = questionsRepository;

    public IEnumerable<Question> GetAll(QuizGameUser user, string? category, string? date, int? startIndex, int? pageSize)
    {
        var isValidDate = DateTime.TryParse( date, out DateTime dateResult)

        IEnumerable<Question>? questions;
        Expression<Func<Question,bool>> expression = p => 
            p.Owner == null || p.Owner == user &&
            (category == null || p.Category == category) &&
            ( !isValidDate || p.CreatedAt == dateResult);



        if(category != null)
        {
            expression p.Category == category;
            questions = _questionsRepository
                .ReadAll
                (p => 
                    p.Owner == null || 
                    p.Owner == user && 
                    p.Category == category, 
                    startIndex, 
                    pageSize 
                );
        }
        else
        {
            questions = _questionsRepository
                .ReadAll
                ( p => 
                    p.Owner == null || 
                    p.Owner == user,
                    startIndex,
                    pageSize
                );
        }
        return questions.OrderBy( p => p.CreatedAt);
    }

    public async Task<bool> AddQuestion(QuizGameUser user, bool owned, Question question)
    {
        if(owned)
            question.Owner = user;

        //change from dto to question?
        
        if(await _questionsRepository.Create(question))
            return true;
        
        return false;
    }

    public async Task<bool> UpdateQuestion(Question questionToUpdate, QuizGameUser user)
    {
        var question = await _questionsRepository.ReadById(questionToUpdate.Id);
        if( question is null)
            return false;
        
        if( question.Owner != null || question.Owner != user)
            return false;

        if( question.AssignedQuizzes != null && question.AssignedQuizzes.Count > 0)
            return false;

        //change from dto to question?

        if( await _questionsRepository.Update(question))
            return true;

        return false;
    }

    public async Task<bool> DeleteQuestion(int id, QuizGameUser user)
    {
        var question = await _questionsRepository.ReadById(id);
        if( question is null)
            return false;

        if( question.Owner != null || question.Owner != user)
            return false;

        if( question.AssignedQuizzes != null && question.AssignedQuizzes.Count > 0)
            return false;

        if(await _questionsRepository.Delete(question))
            return true;

        return false;
    }
}

