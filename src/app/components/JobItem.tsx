"use client";
import { Job } from "@/components/types";

interface JobItemProps {
  job: Job;
  updateJob: (id: string) => void;
  deleteJob: (id: string) => void;
}

const JobItem = ({ job, updateJob, deleteJob }: JobItemProps) => {
  const { title, company, status, _id } = job;
  console.log("Job in Job:", job);

  return (
    <div>
      <h3>
        {title} at {company}
      </h3>
      <p>Status: {status}</p>
      <button onClick={() => updateJob(_id)}>Update Status</button>
      <button onClick={() => deleteJob(_id)}>Delete</button>
    </div>
  );
};

export default JobItem;
