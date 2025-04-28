"use client";
import { useEffect, useState } from "react";
import JobForm from "@/components/JobForm";
import JobList from "@/components/JobList";
import { Job } from "@/components/types";

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch("/api/jobs"); // Your API endpoint
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched jobs:", data);
          setJobs(data); // Set jobs from database
        } else {
          console.error("Failed to fetch jobs:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    }

    fetchJobs(); // Call it immediately
  }, []);

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

  const deleteJob = async (id: string) => {
    try {
      const response = await fetch("/api/jobs", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));
        console.log("Job deleted successfully");
      } else {
        console.error("Failed to delete job:", await response.text());
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <div className="p-4">
      <main className="">
        <div>
          <h1>Job Search Tool</h1>
          <JobForm addJob={addJob} />
          <JobList jobs={jobs} updateJob={updateJob} deleteJob={deleteJob} />
        </div>
      </main>
    </div>
  );
}
