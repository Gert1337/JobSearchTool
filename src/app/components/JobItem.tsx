"use client";
import { Job, Note } from "@/components/types";
import Link from "next/link";
import Modal from "./Modal";
import NoteForm from "./NoteForm";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { jobsAtom } from "@/(atoms)/atoms";

interface JobItemProps {
  job: Job;
  updateJob: (id: string) => void;
  deleteJob: (id: string) => void;
}

const JobItem = ({ job, updateJob, deleteJob }: JobItemProps) => {
  const { title, company, status, _id, dateApplied, notes } = job;
  const [, setJobs] = useAtom(jobsAtom);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<{
    note: Note;
    index: number;
  } | null>(null);
  const router = useRouter();
  if (!_id) {
    return null;
  }
  const idString = typeof _id === "string" ? _id : _id.toString();

  const handleEditNote = (index: number) => {
    if (!notes) return;
    setNoteToEdit({ note: notes[index], index });
    setShowNoteModal(true);
  };

  const handleDeleteNote = async (index: number) => {
    try {
      const response = await fetch(`/api/jobs/${idString}/note/${index}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Note deleted");
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job._id?.toString() === idString
              ? {
                  ...job,
                  notes: job.notes?.filter((_, i) => i !== index) || [],
                }
              : job
          )
        );
      } else {
        console.error("Failed to delete note:", response.statusText);
      }
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const handleAddNote = (newNote: Note) => {
    setJobs((prevJobs) =>
      prevJobs.map((j) =>
        j._id?.toString() === idString
          ? { ...j, notes: [...(j.notes || []), newNote] }
          : j
      )
    );
  };

  
  
  const formattedDate =
    dateApplied instanceof Date
      ? dateApplied.toLocaleDateString()
      : dateApplied;

  return (
    <div className="p-6 bg-white border rounded shadow-sm">
      <Modal
        isOpen={showNoteModal}
        onClose={() => {
          setShowNoteModal(false);
          setNoteToEdit(null);
        }}
        title={noteToEdit ? "Edit Note" : "Add Note"}
      >
        <NoteForm
          jobId={idString}
          initialNote={noteToEdit?.note}
          noteIndex={noteToEdit?.index}
          onNoteAdded={handleAddNote}
          onSuccess={() => {
            setShowNoteModal(false);
            setNoteToEdit(null);
            router.refresh();
          }}
          onCancel={() => {
            setShowNoteModal(false);
            setNoteToEdit(null);
          }}
        />
      </Modal>
      <h3 className="text-xl font-semibold text-gray-900 mt-4">
        {title} at{" "}
        <Link
          href={`/companies/${company.toLocaleLowerCase()}`}
          className="text-blue-600 hover:underline"
        >
          {company}
        </Link>
      </h3>
      <p className="text-sm text-gray-600">
        {" "}
        Status: <span className="font-medium">{status}</span>
      </p>
      <p>
        {" "}
        Date applied:{" "}
        <span className="font-medium">{formattedDate || "No date"}</span>
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => updateJob(idString)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover:shadow-md transition-transform duration-150 hover:scale-[1.02]"
        >
          Update Status
        </button>
        <button
          onClick={() => deleteJob(idString)}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 hover:shadow-md transition-transform duration-150 hover:scale-[1.02]"
        >
          Delete
        </button>
        <button
          onClick={() => {
            setNoteToEdit(null);
            setShowNoteModal(true);
          }}
          className="bg-gray-100 text-gray-800 px-4 py-2 rounded border hover:bg-gray-200 hover:shadow-md transition-transform duration-150 hover:scale-[1.02]"
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
                className={`relative w-48 min-h-48 bg-yellow-200 p-4 pt-6 rounded-md shadow-md transform transition-transform duration-200 ${
                  index % 3 === 0
                    ? "rotate-[-2deg]"
                    : index % 3 === 1
                    ? "rotate-[1deg]"
                    : "rotate-[3deg]"
                } hover:rotate-0`}
              >
                {/* Pin (emoji or styled circle) */}
                <div className="absolute top-1 left-1 text-xl pointer-events-none">
                  📌
                </div>

                <h5 className="font-bold text-sm">{note.title}</h5>
                <p className="text-xs">Mood: {note.mood || "No mood"}</p>
                <p className="text-xs">Date: {note.date}</p>
                <h6 className="font-semibold mt-2 text-sm">Note:</h6>
                <p className="text-sm mb-4 whitespace-pre-wrap break-words">
                  {note.note}
                </p>

                {/* Buttons */}
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <button
                    className="text-blue-600 text-xs hover:underline"
                    onClick={() => handleEditNote(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 text-xs hover:underline"
                    onClick={() => handleDeleteNote(index)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobItem;
