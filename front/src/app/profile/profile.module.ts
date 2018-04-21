import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileComponent} from './profile.component';
import {RouterModule, Routes} from '@angular/router';
import {VideosComponent} from './videos/videos.component';
import {
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatProgressBarModule
} from '@angular/material';
import {VideosCreateComponent} from './videos-create/videos-create.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NgUploaderModule} from 'ngx-uploader';
import {VideosService} from './videos.service';
import {VideoViewComponent} from './video-view/video-view.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: 'videos/:id',
        component: VideoViewComponent,
      },
      {
        path: 'videos',
        component: VideosComponent,
      },
      {
        path: 'videos-create',
        component: VideosCreateComponent,
      }
    ],
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatListModule,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    NgUploaderModule,
    MatProgressBarModule,
  ],
  declarations: [ProfileComponent, VideosComponent, VideosCreateComponent, VideoViewComponent],
  providers: [VideosService],
})
export class ProfileModule {
}
