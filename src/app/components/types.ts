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

export interface Company {
	_id?: ObjectId | string; 
	name: string;
	mission: string;
	vision: string;
	values: string[];
	slug?: string
	contactDetails: {
	  phone: string;
	  email: string;
	  address: string;
	};
	whyWorkHere: string;
	rating: number;
	jobPositions: string[]; // Array of Job IDs related to this company
  }