import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UploadOutput } from 'ngx-uploader';
import { Subject } from 'rxjs';
import { from } from 'rxjs/internal/observable/from';
import { first, flatMap, last, takeUntil, tap } from 'rxjs/operators';
import { EchoService } from '../../services/echo.service';
import { Attachment, Video } from '../video-interfaces';
import { Chunk, VideosService } from '../videos.service';

@Component({
  selector: 'app-video-form',
  templateUrl: './video-form.component.html',
  styleUrls: ['./video-form.component.css'],
})
export class VideoFormComponent implements OnInit, OnDestroy {

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
  thumbnails: Attachment[] = [];
  chunks: Chunk[];
  size: number;

  private _video: Video;
  private destroy$ = new Subject();

  constructor(private fb: FormBuilder, private videosService: VideosService, private echoService: EchoService) {
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

  changePreview(thumbnail: Attachment) {
    this.preview = thumbnail;
    this.videoForm.get('preview_id').patchValue(thumbnail.id);
    this.videoForm.markAsDirty();
  }

  private uploadFile(file: File) {
    this.thumbnails = [];
    this.preview = undefined;
    this.videoForm.get('preview_id').reset();
    this.videoForm.get('attachment_id').reset();
    this.progress = 0;
    this.uploading = true;

    this.size = file.size;
    this.chunks = [];

    const chunkSize = 10 * 1024 * 1024;

    let end = 0;
    let start;
    while (end < this.size) {
      start = end;
      end = Math.min(end + chunkSize, this.size);
      this.chunks.push({
        start,
        end,
        loaded: 0,
        blob: file.slice(start, end, file.type),
      });
    }

    this.videosService.upload(this.size)
      .pipe(first())
      .subscribe(attachment => {
        this.attachment = attachment;
        from(this.chunks)
          .pipe(
            flatMap((chunk: Chunk) => {
              return this.videosService.uploadChunk(this.attachment, chunk)
                .pipe(tap(event => this.handleUpload(event, chunk)));
            }, 2),
            last(),
          )
          .subscribe(r => {
            this.uploading = false;
            this.attachment = r.body.data;
            this.videoForm.get('attachment_id').patchValue(this.attachment.id);
            this.videoUploaded.emit(this.videoForm.value);
            this.echoService.privateChannel<Attachment[]>(`video-file.${this.attachment.id}`, 'ThumbnailsCreated')
              .pipe(takeUntil(this.destroy$))
              .subscribe(thumbnails => {
                this.thumbnails = thumbnails;
                this.preview = thumbnails[0];
                this.videoForm.get('preview_id').patchValue(this.preview.id);
              });
          });
      });
  }

  private handleUpload(event, chunk: Chunk) {
    if (event.hasOwnProperty('type') && event.type === HttpEventType.UploadProgress) {
      chunk.loaded = event.loaded;
      this.progress = this.chunks.reduce((prev, c) => prev + c.loaded, 0) / this.size;
    }
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
    this.thumbnails = video.attachment.thumbnails;
  }

  get video() {
    return this._video;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
