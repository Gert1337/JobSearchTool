import { ObjectId } from 'mongodb';
import clientPromise from './mongodb';

import {Job} from '@/components/types'

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

// List all jobs
export async function listJobs(): Promise<Job[]> {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection<Job>('jobs');

  const jobs = await collection.find().sort({ createdAt: -1 }).toArray();

  // Convert _id to string before returning
  const serializedJobs = jobs.map(job => ({
    ...job,
    _id: job._id.toString()  // Convert ObjectId to string
  }));

  return serializedJobs;
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