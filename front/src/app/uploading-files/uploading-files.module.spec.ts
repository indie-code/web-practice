import { UploadingFilesModule } from './uploading-files.module';

describe('UploadingFilesModule', () => {
  let uploadingFilesModule: UploadingFilesModule;

  beforeEach(() => {
    uploadingFilesModule = new UploadingFilesModule();
  });

  it('should create an instance', () => {
    expect(uploadingFilesModule).toBeTruthy();
  });
});
