"use client";
import { jobsAtom } from "@/(atoms)/atoms";
import JobItem from "@/components/JobItem";
import { useAtom } from "jotai";


const JobList = () => {
  const [jobs, setJobs] = useAtom(jobsAtom); // Access the jobs state

  const updateJob = (id: string) => {
    const updatedJobs = jobs.map((job) =>
      job._id === id
        ? {
            ...job,
            status: "offer" as "applied" | "interviewing" | "offer" | "rejected",
          }
        : job
    );
    setJobs(updatedJobs); // Update the atom when a job is updated
  };

  const deleteJob = async (id: string) => {
    try {
      const response = await fetch(`/api/jobs`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id)); // Remove the job from atom
        console.log("Job deleted successfully");
      } else {
        console.error("Failed to delete job:", await response.text());
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <section className="w-full max-w-2xl">
      <h2 className="text-2xl font-semibold mb-6">Job Listings</h2>
      <ul className="flex flex-col gap-6">
        {jobs.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>No jobs found.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <li key={job._id?.toString() || ''}>
              <JobItem
                job={job}
                updateJob={updateJob}
                deleteJob={deleteJob}
              />
            </li>
          ))
        )}
      </ul>
    </section>
  );
};

export default JobList;