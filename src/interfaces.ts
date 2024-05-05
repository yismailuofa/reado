import { DateTime, Duration } from "luxon";

export enum SourceType {
  Article = "Article",
  Video = "Video",
  Book = "Book",
}

export enum Status {
  NotStarted = "Not Started",
  InProgress = "In Progress",
  Completed = "Completed",
}

export interface Source {
  id: number;
  createdAt: DateTime;
  updatedAt: DateTime;
  title: string;
  authors: string;
  url: string;
  timeRead: Duration;
  type: SourceType;
  status: Status;
}
