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
  file: {
    f: File;
    page: number;
  } | null;
  timeRead: Duration;
  type: SourceType;
  status: Status;
}

export interface AggrStats {
  totalTimeRead: Duration;
  numCompleted: number;
  numInProgress: number;
  numNotStarted: number;
}
