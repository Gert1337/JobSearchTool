import clientPromise from './mongodb';

export interface Job {
  title: string;
  company: string;
  status: 'applied' | 'interviewing' | 'offer' | 'rejected';
  notes?: string;
  createdAt: Date;
}

// Create a new job
export async function createJob(job: Omit<Job, 'createdAt'>) {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection<Job>('jobs');

  const result = await collection.insertOne({
    ...job,
    createdAt: new Date(),
  });

  return result;
}

// List all jobs
export async function listJobs() {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection<Job>('jobs');

  const jobs = await collection.find().sort({ createdAt: -1 }).toArray();
  return jobs;
}