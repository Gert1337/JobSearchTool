import { ObjectId } from 'mongodb';
import clientPromise from './mongodb';

export interface Job {
  _id?: string; // MongoDB's generated ID will be added
  title: string;
  company: string;
  status: 'applied' | 'interviewing' | 'offer' | 'rejected';
  notes?: string;
  createdAt: Date;
}

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
  return jobs;
}

export async function deleteJob(id: string) {
	const client = await clientPromise;
	const db = client.db();
	const collection = db.collection("jobs");

	const result = await collection.deleteOne({ _id: new ObjectId(id) });
	return result;
}