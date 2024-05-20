export interface PageData<T>{
    data: T[];
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
}