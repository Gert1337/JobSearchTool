"use client";

import { useState } from "react";
import { Job } from "@/components/types";

interface JobFormProps {
  addJob: (job: Job) => void;
}

const JobForm = ({ addJob }: JobFormProps) => {
  const [jobTitle, setJobTitle] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [status, setStatus] = useState<string>("Applied");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newJob = {
      title: jobTitle,
      company: companyName,
      status: status,
      notes: "",
    };

    console.log("Submitting job:", newJob);

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newJob),
      });

      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (response.ok) {
        addJob(responseData);
        setJobTitle("");
        setCompanyName("");
        setStatus("Applied");
      } else {
        console.error("Error saving job:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending job data:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 bg-white p-6 rounded-md max-w-2xl"
    >
      <div className="flex flex-col">
        <label htmlFor="jobTitle" className="text-sm font-medium mb-2">
          Job Title
        </label>
        <input
          type="text"
          id="jobTitle"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          required
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="companyName" className="text-sm font-medium mb-2">
          Company
        </label>
        <input
          type="text"
          id="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="status" className="text-sm font-medium mb-2">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Applied">Applied</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Rejected">Rejected</option>
          <option value="Offer">Offer</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 transition-colors"
      >
        Add Job
      </button>
    </form>
  );
};

export default JobForm;
