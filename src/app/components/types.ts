import { ObjectId } from "mongodb";

export interface Job {
	_id?: ObjectId | string; // 👈 allow _id to be optional (for inserts)
	title: string;
	company: string;
	status: "applied" | "interviewing" | "offer" | "rejected";
	notes?: string;
	createdAt: Date;
  dateApplied: Date; 
}