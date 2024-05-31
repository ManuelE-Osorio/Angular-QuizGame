using System.Diagnostics;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Identity.Client.AppConfig;
using QuizGame.Data;
using QuizGame.Models;
using QuizGame.Repositories;

namespace QuizGame.Services;

public interface IQuizGameService {}

public class QuestionsService(
    IQuizGameRepository<Question> questionsRepository,
    IQuizGameRepository<Game> gameRepository ) : IQuizGameService
{
    private readonly IQuizGameRepository<Question> _questionsRepository = questionsRepository;
    private readonly IQuizGameRepository<Game> _gameRepository = gameRepository;

    public async Task<PageData<QuestionListDto>> GetAll(QuizGameUser user, string? category, string? date, int? startIndex, int? pageSize)
    {
        var isValidDate = DateTime.TryParse( date, out DateTime dateResult);

        Expression<Func<Question,bool>> expression = p => 
            (p.Owner == null || p.Owner == user) &&
            (category == null ||
            (p.Category != null && p.Category.Contains(category))) &&
            (!isValidDate || 
            (p.CreatedAt != null && p.CreatedAt.Value.Date == dateResult.Date));

        var questions = _questionsRepository
            .ReadAll(expression, startIndex, pageSize)
            .OrderBy( p => p.CreatedAt)
            .Skip(startIndex ?? 0)
            .Take(pageSize ?? 5);
        
        var totalQuestions = await _questionsRepository.Count(expression);

        return new PageData<QuestionListDto>
        (
            questions.Select(p => new QuestionListDto(p)),
            totalQuestions,
            startIndex,
            pageSize
        );
    }

    public IEnumerable<QuestionForUserDto> GetByGameId(int id, QuizGameUser user)
    {
        Expression<Func<Game,bool>> expression = p => 
            p.Id == id &&
            p.AssignedUsers!.Any(q => q == user);

        var game = _gameRepository.ReadAll(expression, 0, 5).FirstOrDefault()
            ?? throw new Exception("Game not assigned to user");

        Expression<Func<Question,bool>> expressionQuestion = p => 
            p.AssignedQuizzes!.Any( q => q == game.Quiz);
            
        var questions = _questionsRepository
            .ReadAll(expressionQuestion, null, null);

        return questions.Select(p => new QuestionForUserDto(p));
    }

    public async Task<QuestionDto> GetById(int id, QuizGameUser user)
    {
        var question = await _questionsRepository.ReadById(id) ?? throw new Exception("Quiz not found");
        if (question.Owner != null && question.Owner.Id != user.Id)
            throw new Exception("Question is not owned by the user making the request");

        return new QuestionDto(question);
    }

    public async Task<QuestionDto?> AddQuestion(QuizGameUser user, bool owned, QuestionDto questionDto)
    {
        var question = new Question(questionDto);
        if(owned)
            question.Owner = user;

        var operationSuccesfull = await _questionsRepository.Create(question);

        if(operationSuccesfull)
            return new QuestionDto(question);
        
        return null;
    }

    public async Task<bool> UpdateQuestion(QuestionDto questionDto, QuizGameUser user)
    {
        var question = await _questionsRepository.ReadById(questionDto.Id) ?? 
            throw new Exception("Question not found");

        if ( question.Owner != null && question.Owner.Id != user.Id)
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

