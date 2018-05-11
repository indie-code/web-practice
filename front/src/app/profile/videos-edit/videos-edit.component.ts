import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil, flatMap, first} from 'rxjs/operators';
import {VideosService} from '../videos.service';
import {Video} from '../video-interfaces';
import {VideoFormComponent} from '../video-form/video-form.component';

@Component({
  selector: 'app-videos-edit',
  templateUrl: './videos-edit.component.html',
  styleUrls: ['./videos-edit.component.css']
})
export class VideosEditComponent implements OnInit, OnDestroy {

  @ViewChild(VideoFormComponent) private videoFormComponent;

  video: Video;

  private destroy$ = new Subject();

  constructor(private activatedRoute: ActivatedRoute, private videosService: VideosService) {

  }

  ngOnInit() {
    this.activatedRoute.params
    .pipe(
      takeUntil(this.destroy$),
      flatMap(params => this.videosService.video(params.id)),
      first()
    ).subscribe(video => this.video = video);
  }

  update(video: Video) {
    this.videosService.update(this.video.id, video)
    .pipe(first()).subscribe(responseVideo => {
      this.video = responseVideo;
      this.videoFormComponent.makePristine();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
