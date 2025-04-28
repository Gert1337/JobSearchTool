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
      notes: "", // Optional notes field
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
        addJob(responseData); // Update the UI with the saved job
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
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="jobTitle">Job Title</label>
        <input
          type="text"
          id="jobTitle"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="companyName">Company</label>
        <input
          type="text"
          id="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Applied">Applied</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Rejected">Rejected</option>
          <option value="Offer">Offer</option>
        </select>
      </div>
      <button type="submit">Add Job</button>
    </form>
  );
};

export default JobForm;
