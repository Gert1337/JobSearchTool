"use client";
import { Job } from "@/components/types";
import Link from "next/link";
import Modal from "./Modal";
import AddNoteForm from "./AddNoteForm";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface JobItemProps {
  job: Job;
  updateJob: (id: string) => void;
  deleteJob: (id: string) => void;
}

const JobItem = ({ job, updateJob, deleteJob }: JobItemProps) => {
  const { title, company, status, _id, dateApplied, notes } = job;
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);

  const router = useRouter();

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
      <Modal
        isOpen={showNewNoteModal}
        onClose={() => setShowNewNoteModal(false)}
      >
        <AddNoteForm
          jobId={idString}
          onNoteAdded={() => {
            setShowNewNoteModal(false);
            router.push("/");
          }}
        />
      </Modal>
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
        <button
          onClick={() => setShowNewNoteModal(true)}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          Add note
        </button>
      </div>

      {/* Render Notes if they exist */}
      {notes && notes.length > 0 && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold mb-2">Notes:</h4>
          <div className="flex flex-wrap gap-4">
            {notes.map((note, index) => (
              <div
                key={index}
                className="w-48 min-h-48 bg-yellow-200 p-4 rounded-md shadow-lg relative transform rotate-[-2deg] hover:rotate-0 transition-transform duration-200"
              >
                <h5 className="font-bold text-sm">{note.title}</h5>
                <p className="text-xs">Mood: {note.mood || "No mood"}</p>
                <p className="text-xs">Date: {note.date}</p>
                <h6 className="font-semibold mt-2 text-sm">Note:</h6>
                <p className="text-sm">{note.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobItem;
