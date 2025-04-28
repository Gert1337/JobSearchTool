"use client";
import JobItem from "@/components/JobItem";
import { Job } from "@/components/types";

interface JobListProps {
  jobs: Job[];
  updateJob: (id: string) => void;
  deleteJob: (id: string) => void;
}

const JobList = ({ jobs, updateJob, deleteJob }: JobListProps) => {
  console.log("Jobs in JobList:", jobs);

  if (jobs.length === 0) {
    return (
      <div className="text-center text-gray-500">
        <p>No jobs found.</p>
      </div>
    );
  }

  return (
    <section className="w-full max-w-2xl">
      <h2 className="text-2xl font-semibold mb-6">Job Listings</h2>
      <ul className="flex flex-col gap-6">
        {jobs.map((job) => {
          // Ensure _id is a string for the key and for passing to updateJob/deleteJob
          const jobId = job._id ? job._id.toString() : undefined;

          // Make sure jobId is a valid string before passing to functions
          if (!jobId) {
            return null; // Skip rendering this job if _id is invalid
          }

          return (
            <li key={jobId}>
              <JobItem job={job} updateJob={updateJob} deleteJob={deleteJob} />
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default JobList;