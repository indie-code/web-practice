import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';
import * as queryString from 'query-string';

@Injectable()
export class ApiService {

  constructor(private http: HttpClient) {

  }

  private url(url: string) {
    return environment.apiHost + '/api/' + url;
  }

  get(url: string, data: object = {}): Observable<any> {
    if (Object.keys(data).length > 0) {
      url += '?' + queryString.stringify(data);
    }
    return this.http.get(this.url(url));
  }

  post(url: string, data: object): Observable<any> {
    return this.http.post(this.url(url), data);
  }

  delete(url: string): Observable<any> {
      return this.http.delete(this.url(url));
  }

  put(url: string, data: object): Observable<any> {
      return this.http.put(this.url(url), data);
  }
}
