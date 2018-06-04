import { ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';
import { Attachment } from '../../profile/video-interfaces';
import { MAT_SNACK_BAR_DATA } from '@angular/material';
import { AuthUser } from '../../models/user';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-uploading-files',
  templateUrl: './uploading-files.component.html',
  styleUrls: ['./uploading-files.component.css'],
})
export class UploadingFilesComponent implements OnDestroy {

  user: AuthUser;

  private destroyed$ = new Subject();

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) private data: { attachments: Attachment[] },
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  setAttachments(attachments: Attachment[]) {
    this.data.attachments = attachments;
    this.changeDetectorRef.markForCheck();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}
