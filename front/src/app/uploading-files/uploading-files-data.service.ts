import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Video } from '../profile/video-interfaces';
import { Subject } from 'rxjs/internal/Subject';

@Injectable()
export class UploadingFilesDataService {
  private videoSaved$ = new Subject<VideoSavedMessage>();
  private videoOpened$ = new Subject<number>();
  private videoClosed$ = new Subject<number>();

  videoSaved(message: VideoSavedMessage) {
    this.videoSaved$.next(message);
  }

  onVideoSaved(): Observable<VideoSavedMessage> {
    return this.videoSaved$.asObservable();
  }

  videoOpened(id: number) {
    this.videoOpened$.next(id);
  }

  onVideoOpened(): Observable<number> {
    return this.videoOpened$.asObservable();
  }

  videoClosed(id: number) {
    this.videoClosed$.next(id);
  }

  onVideoClosed(): Observable<number> {
    return this.videoClosed$.asObservable();
  }
}

export interface VideoSavedMessage {
  video: Video;
  attachmentId: number;
}
