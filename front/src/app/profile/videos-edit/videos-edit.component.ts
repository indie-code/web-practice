import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, flatMap, first, tap } from 'rxjs/operators';
import { VideosService } from '../videos.service';
import { Video } from '../video-interfaces';
import { UploadingFilesDataService } from '../../uploading-files/uploading-files-data.service';

@Component({
  selector: 'app-videos-edit',
  templateUrl: './videos-edit.component.html',
  styleUrls: ['./videos-edit.component.css'],
})
export class VideosEditComponent implements OnInit, OnDestroy {

  video: Video;

  private destroy$ = new Subject();

  constructor(
    private activatedRoute: ActivatedRoute,
    private videosService: VideosService,
    private uploadingFilesDataService: UploadingFilesDataService,
  ) {

  }

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        tap(params => this.uploadingFilesDataService.videoOpened(Number(params.id))),
        flatMap(params => this.videosService.video(params.id)),
        first(),
      ).subscribe(video => this.video = video);
  }

  onSaved(video: Video) {
    this.video = video;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.uploadingFilesDataService.videoClosed(this.video.id);
  }
}
