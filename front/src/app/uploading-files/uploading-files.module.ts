import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadingFilesComponent } from './uploading-files/uploading-files.component';
import {MatListModule, MatProgressSpinnerModule} from '@angular/material';
import { UploadingFilesService } from './uploading-files.service';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    MatListModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
  providers: [UploadingFilesService],
  declarations: [UploadingFilesComponent],
  entryComponents: [UploadingFilesComponent],
})
export class UploadingFilesModule { }
