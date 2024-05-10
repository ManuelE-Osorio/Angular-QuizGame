namespace QuizGame.Models;

public class PageData<T> where T : class
{
    public IEnumerable<T> Data {get; set;}
    public int CurrentPage {get; set;}
    public int PageSize {get; set;}
    public int TotalPages {get; set;}
    public int TotalRecords {get; set;}

    public PageData(IEnumerable<T> data, int totalRecords, int? startIndex, int? pageSize)
    {
        Data = data;
        TotalRecords = totalRecords;
        CurrentPage = (startIndex ?? 0) / (pageSize ?? 5);
        PageSize = pageSize ?? 5;
        TotalPages = (int)Math.Ceiling((double)(totalRecords / (pageSize ?? 5)));
    }
}