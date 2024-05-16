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

    public async Task<PageData<QuestionDto>> GetAll(QuizGameUser user, string? category, int? quiz, string? date, int? startIndex, int? pageSize)
    {
        var isValidDate = DateTime.TryParse( date, out DateTime dateResult);

        Expression<Func<Question,bool>> expression = p => 
            (p.Owner == null || p.Owner == user) &&
            (category == null || p.Category == category) &&
            (!isValidDate || p.CreatedAt.Value.Date == dateResult.Date) &&  //compare by day
            (quiz == null || 
            ( p.AssignedQuizzes!= null && p.AssignedQuizzes.Select(p => p.Id).Contains((int) quiz)));

        var questions = _questionsRepository
            .ReadAll(expression, startIndex, pageSize)
            .OrderBy( p => p.CreatedAt);
        
        var totalQuestions = await _questionsRepository.Count(expression);

        return new PageData<QuestionDto>
        (
            questions.Select(p => new QuestionDto(p)),
            totalQuestions,
            startIndex,
            pageSize
        );
    }

    public async Task<bool> AddQuestion(QuizGameUser user, bool owned, QuestionDto questionDto) //switch to question
    {
        var question = new Question(questionDto);
        if(owned)
            question.Owner = user;

        var operationSuccesfull = await _questionsRepository.Create(question);

        if(operationSuccesfull)
            return true;
        
        return false;
    }

    public async Task<bool> UpdateQuestion(QuestionDto questionDto, QuizGameUser user)
    {
        var question = await _questionsRepository.ReadById(questionDto.Id) ?? 
            throw new Exception("Question not found");

        if ( question.Owner != null && question.Owner != user)
            throw new Exception("Question is not owned by the user making the request");

        if( question.AssignedQuizzes != null && question.AssignedQuizzes.Count > 0)
            throw new Exception("Cannot update question with an existing Quiz");

        question.QuestionText = questionDto.QuestionText;
        question.QuestionImage = questionDto.QuestionImage;
        question.SecondsTimeout = questionDto.SecondsTimeout;
        question.RelativeScore = questionDto.RelativeScore;
        question.Category = questionDto.Category;
        question.CreatedAt = questionDto.CreatedAt;
        question.CorrectAnswer = questionDto.CorrectAnswer;
        question.IncorrectAnswers = questionDto.IncorrectAnswers;

        if( await _questionsRepository.Update(question))
            return true;

        return false;
    }

    public async Task<bool> DeleteQuestion(int id, QuizGameUser user)
    {
        var question = await _questionsRepository.ReadById(id) ?? throw new Exception("Question not found");
        if ( question.Owner != null && question.Owner.Id != user.Id)
            throw new Exception("Question is not owned by the user making the request");

        if( question.AssignedQuizzes != null && question.AssignedQuizzes.Count > 0)
            throw new Exception("Cannot delete question with an existing Quiz");

        if(await _questionsRepository.Delete(question))
            return true;

        return false;
    }
}

