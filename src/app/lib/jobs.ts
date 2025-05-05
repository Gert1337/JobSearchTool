import { ObjectId } from 'mongodb';
import clientPromise from './mongodb';

import {Job, Note} from '@/components/types'


// Create a new job
export async function createJob(job: Omit<Job, 'createdAt'>): Promise<Job> {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection<Job>('jobs');

  const result = await collection.insertOne({
    ...job,
    createdAt: new Date(),
  });

  const createdJob = await collection.findOne({ _id: result.insertedId });

  if (!createdJob) {
    throw new Error('Failed to create job');
  }

  return createdJob; // Return the full job object, including _id
}

// List all jobs with populated company details
export async function listJobs(): Promise<Job[]> {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection<Job>('jobs');

  const jobs = await collection.find().toArray();

  console.log("LOOOOKHERE",jobs)



  return jobs;
}

export async function deleteJob(id: string) {
	const client = await clientPromise;
	const db = client.db();
	const collection = db.collection<Job>('jobs');

	// Ensure the id is a valid ObjectId string
	if (!ObjectId.isValid(id)) {
		throw new Error("Invalid ID format");
	}

	const result = await collection.deleteOne({ _id: new ObjectId(id) });

	if (result.deletedCount === 0) {
		throw new Error("Job not found");
	}

	return true;
}

export async function addNoteToJob(jobId: string, note: Note) {
	const client = await clientPromise;
	const db = client.db();
	const collection = db.collection<Job>('jobs');

	if (!ObjectId.isValid(jobId)) {
		throw new Error('Invalid job ID');
	}

	const result = await collection.updateOne(
		{ _id: new ObjectId(jobId) },
		{ $push: { notes: note } }
	);

	if (result.modifiedCount === 0) {
		throw new Error('Failed to add note');
	}

	return true;
}

export async function deleteDistinctNoteFromJob(jobId: string, noteIndex: number) {
	const client = await clientPromise;
	const db = client.db();
	const collection = db.collection<Job>("jobs");

	if (!ObjectId.isValid(jobId)) {
		throw new Error("Invalid job ID");
	}

	const jobObjectId = new ObjectId(jobId);

	// Step 1: Unset (nullify) the note at the index
	await collection.updateOne(
		{ _id: jobObjectId },
		{ $unset: { [`notes.${noteIndex}`]: 1 } }
	);

	// Step 2: Pull (remove) all nulls from the array
	const result = await collection.updateOne(
		{ _id: jobObjectId },
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		{ $pull: { notes: null as any } }
	);

	if (result.modifiedCount === 0) {
		throw new Error("Failed to delete the note");
	}

	return { success: true };
}

export async function editNoteOnJob(jobId: string, noteIndex: number, updatedNote: Note) {
	const client = await clientPromise;
	const db = client.db();
	const collection = db.collection<Job>("jobs");

	if (!ObjectId.isValid(jobId)) {
		throw new Error("Invalid job ID");
	}

	const result = await collection.updateOne(
		{ _id: new ObjectId(jobId) },
		{ $set: { [`notes.${noteIndex}`]: updatedNote } }
	);

	if (result.modifiedCount === 0) {
		throw new Error("Failed to update the note");
	}

	return { success: true };
}