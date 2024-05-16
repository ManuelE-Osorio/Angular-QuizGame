using System.Diagnostics;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using QuizGame.Data;
using QuizGame.Models;
using QuizGame.Repositories;

namespace QuizGame.Services;

public class QuizzesService(IQuizGameRepository<Quiz> quizzesRepository, IQuizGameRepository<Question> questionsRepository)
{
    private readonly IQuizGameRepository<Quiz> _quizzesRepository = quizzesRepository;
    private readonly IQuizGameRepository<Question> _questionsRepository = questionsRepository;

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

    public async Task<QuizDto> GetById(QuizGameUser user, int id)
    {
        var quiz = await _quizzesRepository.ReadById(id) ?? throw new Exception("Quiz not found");
        if (quiz.Owner != null && quiz.Owner != user)
            throw new Exception("Quiz is not owned by the user making the request");

        return new QuizDto(quiz);
    }

    public async Task<bool> AddQuiz(QuizGameUser user, bool owned, QuizDto quizDto)
    {
        var quiz = new Quiz(quizDto);
        if(owned)
            quiz.Owner = user;

        if(quizDto.Questions is not null)
        {
            quiz.Questions = [];
            foreach(int id in quizDto.Questions)
            {
                var question = await _questionsRepository.ReadById(id) ?? 
                    throw new Exception("Question does not exists");
                quiz.Questions.Add(question);
            }
        }
        
        if(await _quizzesRepository.Create(quiz))
            return true;
        
        return false;
    }

    public async Task<bool> UpdateQuiz(QuizDto quizDto, QuizGameUser user)
    {
        var quiz = await _quizzesRepository.ReadById(quizDto.Id) ?? throw new Exception("Quiz not found");
        if ( quiz.Owner != null && quiz.Owner != user)
            throw new Exception("Quiz is not owned by the user making the request");

        if( quiz.Games != null && quiz.Games.Count > 0)
            throw new Exception("Cannot update quiz with assigned games.");

        quiz.Id = quizDto.Id;
        quiz.Name = quizDto.Name;
        quiz.Description = quizDto.Description;
        if(quizDto.Questions is not null)
        {
            quiz.Questions = [];
            foreach(int id in quizDto.Questions)
            {
                var question = await _questionsRepository.ReadById(id) ?? 
                    throw new Exception("Question does not exists");
                quiz.Questions.Add(question);
            }
        }

        if( await _quizzesRepository.Update(quiz))
            return true;

        return false;
    }

    public async Task<bool> DeleteQuiz(int id, QuizGameUser user)
    {
        var quiz = await _quizzesRepository.ReadById(id) ?? throw new Exception("Quiz not found");
        if ( quiz.Owner != null && quiz.Owner != user)
            throw new Exception("Quiz is not owned by the user making the request");

        if( quiz.Games != null && quiz.Games.Count > 0)
            throw new Exception("Cannot delete quiz with assigned games.");

        if(await _quizzesRepository.Delete(quiz))
            return true;

        return false;
    }
}

