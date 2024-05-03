export enum SourceType {
  Article = "article",
  Video = "video",
  Podcast = "podcast",
  Book = "book",
  Course = "course",
}

export interface Source {
  id: string;
  title: string;
  authors: string;
  url: string;
  timeRead: number;
  type: SourceType;
}
