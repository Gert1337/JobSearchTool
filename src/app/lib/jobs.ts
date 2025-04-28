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

// List all jobs with populated company details
export async function listJobs(): Promise<Job[]> {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection<Job>('jobs');

  const jobs = await collection.aggregate([
    {
      $lookup: {
        from: 'companies', // The companies collection
        localField: 'companyId',
        foreignField: '_id',
        as: 'company', // Field name for joined company data
      },
    },
    { $unwind: '$company' }, // Flatten the result to include only the first company
    { $sort: { createdAt: -1 } }, // Sort by createdAt (latest job first)
  ]).toArray();

  // Convert _id to string and return jobs with company details
  const serializedJobs = jobs.map((job) => ({
    _id: job._id.toString(), // Convert ObjectId to string
    title: job.title,         // Make sure all fields required by Job are included
    status: job.status,
    createdAt: job.createdAt.toString(), // Convert Date to string
    dateApplied: job.dateApplied.toString(), // Convert Date to string
    company: job.company.name, // Assuming you only want to show the company name, adjust accordingly
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