import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFramework } from './shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private url: string = './assets/frameworks.json';
  constructor(private http: HttpClient) { }

  getFrameworks(): Observable<IFramework[]> {
    return this.http.get<IFramework[]>(this.url);
  }
}
