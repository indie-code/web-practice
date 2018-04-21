import {Injectable} from '@angular/core';
import {ApiService} from '../api.service';
import {Observable} from 'rxjs/Observable';
import {Video} from "./video-interfaces";
import {map} from "rxjs/operators";

@Injectable()
export class VideosService {
  
  constructor(private api: ApiService) {
  }
  
  upload(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.api.request('POST', 'video-files', formData, {reportProgress: true});
  }
  
  my(): Observable<Video[]> {
    return this.api.get('profile/videos').pipe(map(response => response.data));
  }
  
  video(id: number): Observable<Video> {
    return this.api.get('videos/' + id).pipe(map(response => response.data));
  }
}

