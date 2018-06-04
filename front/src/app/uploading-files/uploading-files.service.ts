import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {Attachment} from '../profile/video-interfaces';
import {ApiService} from '../api.service';
import {map} from 'rxjs/operators';

@Injectable()
export class UploadingFilesService {

  constructor(private api: ApiService) { }

  uploading(): Observable<Attachment[]> {
    return this.api.get('video-files/uploading').pipe(map(response => response.data));
  }
}
