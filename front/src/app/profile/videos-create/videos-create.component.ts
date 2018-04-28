import {Component} from '@angular/core';
import {VideosService} from '../videos.service';
import {Video} from '../video-interfaces';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-videos-create',
  templateUrl: './videos-create.component.html',
})
export class VideosCreateComponent {

  constructor(
    private videosService: VideosService,
    private router: Router
    ) {}

  create(video: Video) {
    this.videosService.store(video)
    .pipe(first())
    .subscribe(responseVideo => this.router.navigateByUrl('/profile/videos-edit/' + responseVideo.id));
  }
}
