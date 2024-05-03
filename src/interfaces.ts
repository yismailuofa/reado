import { DateTime, Duration } from "luxon";

export enum SourceType {
  Article = "Article",
  Video = "Video",
  Podcast = "Podcast",
  Book = "Book",
  Course = "Course",
}

export enum Status {
  NotStarted = "Not Started",
  InProgress = "In Progress",
  Completed = "Completed",
}

export interface Source {
  id: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  title: string;
  authors: string;
  url: string;
  timeRead: Duration;
  type: SourceType;
  status: Status;
}
