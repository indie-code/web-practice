import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UploadOutput} from 'ngx-uploader';
import {VideosService} from '../videos.service';
import {last, tap} from 'rxjs/operators';
import {HttpEventType, HttpProgressEvent, HttpResponse} from '@angular/common/http';
import {Attachment} from '../video-interfaces';

@Component({
  selector: 'app-videos-create',
  templateUrl: './videos-create.component.html',
  styleUrls: ['./videos-create.component.css'],
})
export class VideosCreateComponent implements OnInit {

  videoForm: FormGroup;

  progress: number;
  uploading = false;
  dragOver = false;
  attachment: Attachment;
  preview: Attachment;

  constructor(private fb: FormBuilder, private videosService: VideosService) {
  }

  ngOnInit() {
    this.videoForm = this.fb.group({
      title: '',
      description: '',
      attachment_id: undefined,
      preview_id: undefined,
    });
  }

  onUploadOutput(output: UploadOutput) {

    switch (output.type) {
      case 'dragOver':
        this.dragOver = true;
        break;
      case 'dragOut':
        this.dragOver = false;
        break;
      case 'addedToQueue':
        this.uploadFile(output.file.nativeFile);
        break;
    }
  }

  showProgress(event: HttpProgressEvent) {
    this.progress = event.loaded / event.total;
  }

  changePreview(thumbnail: Attachment) {
    this.preview = thumbnail;
  }

  private uploadFile(file: File) {
    this.uploading = true;
    this.videosService.upload(file)
    .pipe(
      tap(event => {
        if (event.hasOwnProperty('type') && event.type === HttpEventType.UploadProgress) {
          this.showProgress(event);
        }
      }),
      last(),
    )
    .subscribe((response: HttpResponse<{ data: Attachment }>) => {
      this.attachment = response.body.data;
      this.preview = this.attachment.thumbnails[0];
      this.uploading = false;
      this.videoForm.get('attachment_id').patchValue(this.attachment.id);
      this.videoForm.get('preview_id').patchValue(this.preview.id);
    });
  }
}
