"use client";
import { Job } from "@/components/types";

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
        {title} at {company}
      </h3>
      <p>Status: {status}</p>
      <p>Date applied: {formattedDate ? formattedDate : "No date"}</p>
      <button onClick={() => updateJob(idString)}>Update Status</button>
      <button onClick={() => deleteJob(idString)}>Delete</button>

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
