export enum SourceType {
  Article = "Article",
  Video = "Video",
  Podcast = "Podcast",
  Book = "Book",
  Course = "Course",
}

export interface Source {
  id: string;
  title: string;
  authors: string;
  url: string;
  timeRead: number;
  type: SourceType;
}
