import {Component, OnDestroy, OnInit} from '@angular/core';
import {VideosService} from '../videos.service';
import {Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {first, takeUntil} from 'rxjs/operators';
import {Video} from '../video-interfaces';
import {TokenStorageService} from '../../token-storage.service';

@Component({
  selector: 'app-video-view',
  templateUrl: './video-view.component.html',
  styleUrls: ['./video-view.component.css']
})
export class VideoViewComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject();

  video: Video;
  token: string;

  constructor(
    private videosService: VideosService,
    private route: ActivatedRoute,
    private tokensService: TokenStorageService,
  ) { }

  ngOnInit() {
    this.route.params
    .pipe(takeUntil(this.destroy$))
    .subscribe(params => this.loadVideo(params.id));

    this.token = this.tokensService.token();
  }

  private loadVideo(id: number) {
    this.videosService.video(id).pipe(first()).subscribe(video => this.video = video);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
