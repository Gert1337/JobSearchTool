"use client";
import { useState } from "react";
import JobForm from "@/components/JobForm";
import JobList from "@/components/JobList";
import { Job } from "@/components/types";

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);

  const addJob = (newJob: Job) => {
    setJobs((prevJobs) => {
      console.log("Previous jobs:", prevJobs); // Log the previous jobs state
      const updatedJobs = [...prevJobs, newJob];
      console.log("Updated jobs:", updatedJobs); // Log the updated jobs state
      return updatedJobs;
    });
  };

  const updateJob = (id: string) => {
    const updatedJobs = jobs.map((job) =>
      job._id === id ? { ...job, status: "Offer" } : job
    );
    setJobs(updatedJobs);
  };

  const deleteJob = (id: string) => {
    const updatedJobs = jobs.filter((job) => job._id !== id);
    setJobs(updatedJobs);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div>
          <h1>Job Search Tool</h1>
          <JobForm addJob={addJob} />
          <JobList jobs={jobs} updateJob={updateJob} deleteJob={deleteJob} />
        </div>
      </main>
    </div>
  );
}
