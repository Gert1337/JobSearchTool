"use client";
import { Job } from "@/components/types";
import Link from "next/link";

interface JobItemProps {
  job: Job;
  updateJob: (id: string) => void;
  deleteJob: (id: string) => void;
}

const JobItem = ({ job, updateJob, deleteJob }: JobItemProps) => {
  const { title, company, status, _id, dateApplied, notes } = job;

  if (!_id) {
    return null;
  }

  const idString = typeof _id === "string" ? _id : _id.toString();

  console.log("Job in JobItem:", job);
  const formattedDate =
    dateApplied instanceof Date
      ? dateApplied.toLocaleDateString()
      : dateApplied;

  return (
    <div className="p4">
      <h3>
        {title} at{" "}
        <Link
          href={`/companies/${company.toLocaleLowerCase()}`}
          className="text-blue-500 underline"
        >
          {company}
        </Link>
      </h3>
      <p>Status: {status}</p>
      <p>Date applied: {formattedDate ? formattedDate : "No date"}</p>
      <div className="flex gap-2">
        <button
          onClick={() => updateJob(idString)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Update Status
        </button>
        <button
          onClick={() => deleteJob(idString)}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Delete
        </button>
        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition">
          Add note
        </button>
      </div>

      {/* Render Notes if they exist */}
      {notes && notes.length > 0 && (
        <div>
          <h4>Notes:</h4>
          {notes.map((note, index) => (
            <div key={index} className="note p-4">
              <h5>{note.title}</h5>
              <p>Mood: {note.mood || "No mood specified"}</p>
              <p>Date: {note.date}</p>
              <h6>The Note:</h6>
              <p>{note.note}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobItem;
