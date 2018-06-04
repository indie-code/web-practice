import { Component } from '@angular/core';
import { Video } from '../video-interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-videos-create',
  templateUrl: './videos-create.component.html',
})
export class VideosCreateComponent {

  constructor(
    private router: Router,
  ) {
  }

  create(video: Video) {
    this.router.navigateByUrl('/profile/videos-edit/' + video.id);
  }
}
