import {Component, OnInit} from '@angular/core';
import {UploadingFilesService} from './uploading-files/uploading-files.service';
import {AuthService} from './services/auth.service';
import { filter, first, flatMap, takeWhile, tap } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarRef } from '@angular/material';
import {UploadingFilesComponent} from './uploading-files/uploading-files/uploading-files.component';
import { Attachment } from './profile/video-interfaces';
import { EchoService } from './services/echo.service';
import { AuthUser } from './models/user';
import { UploadingFilesDataService } from './uploading-files/uploading-files-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private user: AuthUser;
  private uploadingAttachments: Attachment[] = [];
  private uploadingComponent: MatSnackBarRef<UploadingFilesComponent>;
  private currentOpenedVideoId: number;

  constructor(
    private uploadingFilesService: UploadingFilesService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private echoService: EchoService,
    private uploadingFilesDataService: UploadingFilesDataService,
  ) {}

  ngOnInit(): void {

    this.uploadingFilesDataService.onVideoClosed().subscribe(() => {
      this.currentOpenedVideoId = null;
    });

    this.uploadingFilesDataService.onVideoOpened().subscribe(id => {
      this.currentOpenedVideoId = id;
      this.removeAttachmentVideo(id);
    });

    this.uploadingFilesDataService.onVideoSaved().subscribe(message => {
      const found = this.uploadingAttachments.find(a => a.id === message.attachmentId);
      if (found) {
        found.video = message.video;
      }
      this.finishAttachmentEditing();
    });

    this.authService.user().pipe(
      filter(user => !! user),
      takeWhile(user => user.permissions.attachments.upload),
      tap(user => this.user = user),
      flatMap(() => this.uploadingFilesService.uploading()),
      first(),
      tap(attachments => {
        this.uploadingAttachments = attachments;

        if (! attachments.length) {
          return;
        }

        this.openUploadingSnackBar(attachments);
      }),
      flatMap(() => this.echoService.privateChannel<Attachment>(`uploading-files.${this.user.id}`, 'ChunkUploaded')),
    ).subscribe((attachment: Attachment) => {
      const foundIndex = this.uploadingAttachments.findIndex(a => a.id === attachment.id);
      if (foundIndex === -1) {
          this.uploadingAttachments.unshift(attachment);
      } else {
          this.uploadingAttachments[foundIndex] = attachment;
      }

      if (attachment.uploaded_size === attachment.size) {
        this.removeAttachmentVideo(this.currentOpenedVideoId);
      }

      this.finishAttachmentEditing();
    });
  }

  private removeAttachmentVideo(videoId: number) {
    const foundIndex = this.uploadingAttachments.findIndex(a => a.video && a.video.id === videoId);
    if (foundIndex !== -1) {
      this.uploadingAttachments.splice(foundIndex, 1);
      this.finishAttachmentEditing();
    }
  }

  private finishAttachmentEditing() {
    if (this.uploadingAttachments.length) {
      this.openUploadingSnackBar();
      this.uploadingComponent.instance.setAttachments(this.uploadingAttachments);
    } else if (this.uploadingComponent) {
      this.uploadingComponent.dismiss();
      this.uploadingComponent = null;
    }
  }

  private openUploadingSnackBar(attachments: Attachment[] = []) {

    if (this.uploadingComponent) {
      return;
    }

    this.uploadingComponent = this.snackBar.openFromComponent(UploadingFilesComponent, {
      data: {attachments},
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }
}
