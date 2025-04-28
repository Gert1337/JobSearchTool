"use client";
import { useEffect, useState } from "react";
import JobForm from "@/components/JobForm";
import JobList from "@/components/JobList";
import { Job } from "@/components/types";
import CompanyForm from "./components/CompanyForm";

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<any[]>([]); // Fetch companies here
  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch("/api/jobs"); // Your API endpoint
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched jobs:", data);
          // Ensure that the 'status' is one of the valid options.
          const validJobs: Job[] = data.map((job: Job) => ({
            ...job,
            status: job.status as
              | "applied"
              | "interviewing"
              | "offer"
              | "rejected",
          }));
          setJobs(validJobs); // Set jobs from database
        } else {
          console.error("Failed to fetch jobs:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    }

     // Fetch companies
     async function fetchCompanies() {
      const res = await fetch("/api/companies");
      const data = await res.json();
      setCompanies(data);
    }

    fetchJobs(); // Call it immediately
    fetchCompanies();

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
      job._id === id
        ? {
            ...job,
            status: "offer" as
              | "applied"
              | "interviewing"
              | "offer"
              | "rejected",
          }
        : job
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

  const addCompany = (company: any) => {
    setCompanies((prevCompanies) => [...prevCompanies, company]);
  };

  return (
    <div className="p-4">
      <main className="">
        <div>
          <h1>Job Search Tool</h1>
          <CompanyForm addCompany={addCompany}/>
          <JobForm addJob={addJob} companies={companies} />
          <JobList jobs={jobs} updateJob={updateJob} deleteJob={deleteJob} />
        </div>
      </main>
    </div>
  );
}
