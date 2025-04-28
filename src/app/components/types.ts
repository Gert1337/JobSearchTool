import { ObjectId } from "mongodb";
export interface Note {
  title: string;
  mood?: string;
  date: string;
  note: string;
}

export interface Job {
	_id?: ObjectId | string; 
	title: string;
	company: string;
	status: "applied" | "interviewing" | "offer" | "rejected";
	notes?: Note[];
	createdAt: Date;
  dateApplied: Date; 
}