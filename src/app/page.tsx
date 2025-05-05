"use client";
import { useEffect } from "react";
import JobList from "@/components/JobList";
import { useAtom } from "jotai";
import { Job } from "@/components/types";
import Modal from "./components/Modal";
import AddJobFormWrapper from "./components/AddJobFormWrapper";
import CompanyForm from "./components/CompanyForm";
import {
  jobsAtom,
  companiesAtom,
  showNewJobModalAtom,
  showNewCompanyModalAtom,
} from "@/(atoms)/atoms";

export default function Home() {
  const [, setJobs] = useAtom(jobsAtom);
  const [, setCompanies] = useAtom(companiesAtom);
  const [showNewJobModal, setShowNewJobModal] = useAtom(showNewJobModalAtom);
  const [showNewCompanyModal, setShowNewCompanyModal] = useAtom(
    showNewCompanyModalAtom
  );
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Jobs
        const jobsResponse = await fetch("/api/jobs");
        if (jobsResponse.ok) {
          const jobsData = await jobsResponse.json();
          // Ensure that the 'status' is one of the valid options
          const validJobs: Job[] = jobsData.map((job: Job) => ({
            ...job,
            status: job.status as
              | "applied"
              | "interviewing"
              | "offer"
              | "rejected",
          }));

          // Fetch Companies
          const companiesResponse = await fetch("/api/companies");
          const companiesData = await companiesResponse.json();

          // Map jobs with company names
          const jobsWithCompanyName = validJobs.map((job) => {
            const company = companiesData.find(
              (c: { _id: { toString: () => string; }; }) => c._id?.toString() === job.company?.toString()
            );
            return {
              ...job,
              company: company ? company.name : "Unknown company",
            };
          });

          // Update state
          setCompanies(companiesData);
          setJobs(jobsWithCompanyName); // Set jobs with company names
        } else {
          console.error("Failed to fetch jobs:", jobsResponse.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [setJobs, setCompanies]);

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
          <JobList />
          <Modal
            isOpen={showNewCompanyModal}
            onClose={() => setShowNewCompanyModal(false)}
            title="Add new company"
          >
            <CompanyForm onClose={() => setShowNewCompanyModal(false)} />
          </Modal>
          <Modal
            isOpen={showNewJobModal}
            onClose={() => setShowNewJobModal(false)}
            title="Add new job"
          >
            <AddJobFormWrapper onClose={() => setShowNewJobModal(false)} />
          </Modal>
        </div>
      </main>
    </div>
  );
}
