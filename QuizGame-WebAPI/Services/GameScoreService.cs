using System.Diagnostics;
using System.Linq.Expressions;
using Microsoft.AspNetCore.Identity;
using QuizGame.Models;
using QuizGame.Repositories;

namespace QuizGame.Services;

public class GamesScoreService(
    IQuizGameRepository<GameScore> scoreRepository, 
    IQuizGameRepository<Game> gameRepository, 
    IQuizGameRepository<Quiz> quizzesRepository, 
    IQuizGameRepository<Question> questionsRepository, 
    UserManager<QuizGameUser> userManager) : IQuizGameService
{
    private readonly IQuizGameRepository<GameScore> _scoreRepository = scoreRepository;
    private readonly IQuizGameRepository<Game> _gameRepository = gameRepository;
    private readonly IQuizGameRepository<Quiz> _quizzesRepository = quizzesRepository;
    private readonly IQuizGameRepository<Question> _questionsRepository = questionsRepository;
    private readonly UserManager<QuizGameUser> _userManager = userManager;
    public async Task<PageData<GameScoreDto>> GetAll(QuizGameUser user, string? game, string? date, int? startIndex, int? pageSize)
    {
        var isValidDate = DateTime.TryParse( date, out DateTime dateResult);

        Expression<Func<GameScore,bool>> expression = p => 
            p.User != null && 
            p.User == user &&
            (game == null  || p.Game!.Name == game) &&
            (!isValidDate || p.ResultDate == dateResult);

        var scores = _scoreRepository
            .ReadAll(expression, startIndex, pageSize)
            .OrderBy( p => p.ResultDate);
            
        var totalScores = await _scoreRepository.Count(expression);

        return new PageData<GameScoreDto>
        (
            scores.Select(p => new GameScoreDto(p)),
            totalScores,
            startIndex,
            pageSize
        );
    }

    public async Task<GameScoreDto> GetById(QuizGameUser user, int id)
    {
        var score = await _scoreRepository.ReadById(id) ?? throw new Exception("Score not found");
        if (score.User != null && score.User.Id != user.Id)
            throw new Exception("Score is not owned by the user making the request");

        return new GameScoreDto(score);
    }

    public async Task<GameScoreDto?> AddScore(QuizGameUser user, int gameId, List<CorrectAnswer> answers) //send list of answers
    {
        var game = await _gameRepository.ReadById(gameId) ?? 
            throw new Exception ("Game Id does not exists");

        var score = new GameScore(user, game);

        if(game.Quiz == null)
            throw new Exception("Game doesn't have a Quiz assigned");

        var quiz = await _quizzesRepository.ReadById(game.Quiz.Id);

        Expression<Func<Question,bool>> expression = p => 
            p.AssignedQuizzes!.Select(p => p.Id).Contains(game.Quiz.Id);

        var questions = _questionsRepository.ReadAll(expression, 0, 0) 
            ?? throw new Exception ("Quiz doesn't have Questions assigned");
        score.Score = QuizGrader(answers, questions);
        score.ResultDate = DateTime.Now;

        bool operationSuccesfull = await _scoreRepository.Create(score);

        if(operationSuccesfull)
            return new GameScoreDto(score);
        
        return null;
    }

    public async Task<bool> UpdateScore(GameScoreDto gameScoreDto)
    {
        var score = await _scoreRepository.ReadById(gameScoreDto.Id) ?? 
            throw new Exception("Score not found");

        score.ResultDate = gameScoreDto.ResultDate;
        score.Score = gameScoreDto.Score;
        
        if( await _scoreRepository.Update(score))
            return true;

        return false;
    }

    public async Task<bool> DeleteScore(int id)
    {
        var score = await _scoreRepository.ReadById(id) ?? throw new Exception("Score not found");

        if(await _scoreRepository.Delete(score))
            return true;

        return false;
    }

    private static double QuizGrader(List<CorrectAnswer> answers, IEnumerable<Question> questions){
        CorrectAnswer? currentAnswer;
        double correctAnswers = 0;

        foreach(var question in questions)
        {
            currentAnswer = answers.Find( p => p.Id == question.Id);
            if( question.CorrectAnswer!.Equals(currentAnswer))
            {
                correctAnswers += question.RelativeScore;
            }
        }
        return 100*correctAnswers/questions.Select( p => p.RelativeScore).Sum();
    }
}