import { Component } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Video} from '../video-interfaces';
import {VideosService} from '../videos.service';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent {

  videos$: Observable<Video[]>;

  constructor(private videosService: VideosService) {
    this.videos$ = this.videosService.my();
  }
}
