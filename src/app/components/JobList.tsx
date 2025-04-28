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
  return (
    <div>
      <h2>Job Listings</h2>
      <ul>
        {jobs.map((job) => (
          <JobItem
            key={job._id}
            job={job}
            updateJob={updateJob}
            deleteJob={deleteJob}
          />
        ))}
      </ul>
    </div>
  );
};

export default JobList;
