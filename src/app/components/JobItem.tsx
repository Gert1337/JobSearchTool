"use client";
import { Job } from "@/components/types";

interface JobItemProps {
  job: Job;
  updateJob: (id: string) => void;
  deleteJob: (id: string) => void;
}

const JobItem = ({ job, updateJob, deleteJob }: JobItemProps) => {
  const { title, company, status, _id } = job;

  if (!_id) {
    return null; 
  }

  const idString = typeof _id === "string" ? _id : _id.toString();

  console.log("Job in JobItem:", job);

  return (
    <div>
      <h3>
        {title} at {company}
      </h3>
      <p>Status: {status}</p>
      <button onClick={() => updateJob(idString)}>Update Status</button>
      <button onClick={() => deleteJob(idString)}>Delete</button>
    </div>
  );
};

export default JobItem;