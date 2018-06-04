import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { Attachment, Video } from './video-interfaces';

@Injectable()
export class VideosService {

  constructor(private api: ApiService) {
  }

  upload(totalSize: number, videoId: number): Observable<Attachment> {
    return this.api.post('video-files', {size: totalSize, video_id: videoId})
      .pipe(map(response => response.data));
  }

  uploadChunk(attachment: Attachment, chunk: Chunk): Observable<any> {
    const formData = new FormData();
    formData.append('file', chunk.blob);
    formData.append('start', chunk.start.toString(10));

    return this.api.request('POST', `video-files/${attachment.id}`, formData, {reportProgress: true});
  }

  my(): Observable<Video[]> {
    return this.api.get('profile/videos').pipe(map(response => response.data));
  }

  video(id: number): Observable<Video> {
    return this.api.get('videos/' + id).pipe(map(response => response.data));
  }

  store(video: Video): Observable<Video> {
    return this.api.post('profile/videos', video).pipe(map(response => response.data));
  }

  update(videoId: number, video: Video): Observable<Video> {
    return this.api.put(`profile/videos/${videoId}`, video).pipe(map(response => response.data));
  }
}

export interface Chunk {
  start: number;
  end: number;
  loaded: number;
  blob: Blob;
}
