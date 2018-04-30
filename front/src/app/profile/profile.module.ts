import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileComponent} from './profile.component';
import {RouterModule, Routes} from '@angular/router';
import {VideosComponent} from './videos/videos.component';
import {
  MatButtonModule,
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
import {VideoFormComponent} from './video-form/video-form.component';
import {VideosEditComponent} from './videos-edit/videos-edit.component';

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
      },
      {
        path: 'videos-edit/:id',
        component: VideosEditComponent,
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
    MatButtonModule,
  ],
  declarations: [ProfileComponent, VideosComponent, VideosCreateComponent, VideoViewComponent, VideoFormComponent, VideosEditComponent],
  providers: [VideosService],
})
export class ProfileModule {
}
