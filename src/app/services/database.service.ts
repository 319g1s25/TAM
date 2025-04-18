import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Execute a query to the database
   * @param endpoint The API endpoint
   * @param params Optional parameters for the query
   * @returns Observable with the query result
   */
  query<T>(endpoint: string, params: any = {}): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, params)
      .pipe(
        catchError(this.handleError<T>('query'))
      );
  }

  /**
   * Get data from the database
   * @param endpoint The API endpoint
   * @param id Optional ID to get a specific record
   * @returns Observable with the get result
   */
  get<T>(endpoint: string, id?: string): Observable<T> {
    const url = id ? `${this.apiUrl}/${endpoint}/${id}` : `${this.apiUrl}/${endpoint}`;
    return this.http.get<T>(url)
      .pipe(
        catchError(this.handleError<T>('get'))
      );
  }

  /**
   * Post data to the database
   * @param endpoint The API endpoint
   * @param data The data to post
   * @returns Observable with the post result
   */
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data)
      .pipe(
        catchError(this.handleError<T>('post'))
      );
  }

  /**
   * Update data in the database
   * @param endpoint The API endpoint
   * @param id The ID of the record to update
   * @param data The data to update
   * @returns Observable with the update result
   */
  update<T>(endpoint: string, id: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}/${id}`, data)
      .pipe(
        catchError(this.handleError<T>('update'))
      );
  }

  /**
   * Delete data from the database
   * @param endpoint The API endpoint
   * @param id The ID of the record to delete
   * @returns Observable with the delete result
   */
  delete<T>(endpoint: string, id: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}/${id}`)
      .pipe(
        catchError(this.handleError<T>('delete'))
      );
  }

  /**
   * Handle HTTP errors
   * @param operation The operation that failed
   * @returns An error observable with a user-friendly error message
   */
  private handleError<T>(operation = 'operation') {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return throwError(() => new Error(`${operation} failed: ${error.message}`));
    };
  }
} 