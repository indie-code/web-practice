export interface Attachment {
  id: number;
  url: string;
  thumbnails: Attachment[];
  uploaded_size: number;
  size: number;
  video?: Video;
}

export interface Video {
  id: number;
  title: string;
  description: string;
  attachment_id: number;
  attachment: Attachment;
  preview: Attachment;
}
