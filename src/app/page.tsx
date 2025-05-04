"use client";
import { useEffect, useState } from "react";
import JobList from "@/components/JobList";
import { Job, Company } from "@/components/types";
import Modal from "./components/Modal";
import AddJobFormWrapper from "./components/AddJobFormWrapper";
import CompanyForm from "./components/CompanyForm";

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]); // Fetch companies here
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [showNewCompanyModal, setShowNewCompanyModal] = useState(false);
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

  const jobsWithCompanyName = jobs.map((job) => {
    const company = companies.find((c) => c._id === job.company);
    return {
      ...job,
      company: company ? company.name : "Unknown company",
    };
  });

  return (
    <div className="p-4">
      <main className="">
        <div>
          <h1>Job Search Tool</h1>
          <div className="inline-flex">
            <button
              onClick={() => setShowNewJobModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Add job
            </button>
            <button
              onClick={() => setShowNewCompanyModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Add Company
            </button>
          </div>
          <JobList
            jobs={jobsWithCompanyName}
            updateJob={updateJob}
            deleteJob={deleteJob}
          />
          <Modal
            isOpen={showNewCompanyModal}
            onClose={() => setShowNewCompanyModal(false)}
          >
            <CompanyForm onClose={() => setShowNewCompanyModal(false)}/>
          </Modal>
          <Modal
            isOpen={showNewJobModal}
            onClose={() => setShowNewJobModal(false)}
          >
            <AddJobFormWrapper onClose={() => setShowNewJobModal(false)} />
          </Modal>
        </div>
      </main>
    </div>
  );
}
