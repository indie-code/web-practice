export interface Attachment {
  id: number;
  url: string;
  thumbnails: Attachment[];
}

export interface Video {
  id: number;
  title: string;
  description: string;
  attachment_id: number;
  attachment: Attachment;
  preview: Attachment;
}
