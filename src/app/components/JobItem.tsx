"use client";
import { Job, Note } from "@/components/types";
import Link from "next/link";
import Modal from "./Modal";
import NoteForm from "./NoteForm";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface JobItemProps {
  job: Job;
  updateJob: (id: string) => void;
  deleteJob: (id: string) => void;
}

const JobItem = ({ job, updateJob, deleteJob }: JobItemProps) => {
  const { title, company, status, _id, dateApplied, notes } = job;
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<{ note: Note; index: number } | null>(null);
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
        router.push("/")
        router.refresh(); // This revalidates and fetches fresh server data
      } else {
        console.error("Failed to delete note:", response.statusText);
      }
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  console.log("Job in JobItem:", job);
  const formattedDate =
    dateApplied instanceof Date
      ? dateApplied.toLocaleDateString()
      : dateApplied;

  return (
    <div className="p4">
      <Modal
        isOpen={showNoteModal}
        onClose={() => {setShowNoteModal(false);setNoteToEdit(null);}}
        title={noteToEdit ? "Edit Note" : "Add Note"}
      >
        <NoteForm
          jobId={idString}
          initialNote={noteToEdit?.note}
          noteIndex={noteToEdit?.index}
          onNoteAdded={() => {
            setShowNoteModal(false);
            router.refresh();
          }}
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
          onClick={() => {
						setNoteToEdit(null);
						setShowNoteModal(true);
					}}
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
