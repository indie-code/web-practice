import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Attachment, Video} from '../video-interfaces';
import {last, tap} from 'rxjs/operators';
import {HttpEventType, HttpProgressEvent, HttpResponse} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UploadOutput} from 'ngx-uploader';
import {VideosService} from '../videos.service';

@Component({
  selector: 'app-video-form',
  templateUrl: './video-form.component.html',
  styleUrls: ['./video-form.component.css']
})
export class VideoFormComponent implements OnInit {

  @Input() set video(video: Video) {
    this._video = video;
    if (video && this.videoForm) {
      this.setVideo(video);
    }
  }

  @Output() submitForm: EventEmitter<Video> = new EventEmitter<Video>();
  @Output() videoUploaded: EventEmitter<Video> = new EventEmitter<Video>();

  videoForm: FormGroup;

  progress: number;
  uploading = false;
  dragOver = false;
  attachment: Attachment;
  preview: Attachment;

  private _video: Video;

  constructor(private fb: FormBuilder, private videosService: VideosService) {
  }

  ngOnInit() {
    this.videoForm = this.fb.group({
      title: ['', Validators.required],
      description: '',
      attachment_id: undefined,
      preview_id: undefined,
    });

    if (this.video) {
      this.setVideo(this.video);
    }
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
    this.videoForm.get('preview_id').patchValue(thumbnail.id);
    this.videoForm.markAsDirty();
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
        this.videoUploaded.emit(this.videoForm.value);
      });
  }

  onSubmit() {
    this.submitForm.emit(this.videoForm.value);
  }

  makePristine() {
    this.videoForm.markAsPristine();
  }

  private setVideo(video: Video) {
    this.videoForm.patchValue({
      title: video.title,
      description: video.description,
      attachment_id: video.attachment.id,
      preview_id: video.preview.id,
    });
    this.attachment = video.attachment;
    this.preview = video.preview;
  }

  get video() {
    return this._video;
  }
}
