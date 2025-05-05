"use client";
import { useEffect, useState } from "react";
import { Note } from "./types";

interface NoteFormProps {
  jobId: string;
  initialNote?: Note;
  noteIndex?: number; // If present, it's an edit
  onNoteAdded?: () => void;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const moodEmojis = [
  { label: "Happy", emoji: "😊" },
  { label: "Sad", emoji: "😢" },
  { label: "Excited", emoji: "😄" },
  { label: "Angry", emoji: "😠" },
  { label: "Neutral", emoji: "😐" },
  { label: "Surprised", emoji: "😲" },
];

export default function NoteForm({
  jobId,
  initialNote,
  noteIndex,
  onCancel,
  onSuccess,
  onNoteAdded,
}: NoteFormProps) {
  const [note, setNote] = useState(
    initialNote || {
      title: "",
      mood: "",
      date: new Date().toISOString().split("T")[0],
      note: "",
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = noteIndex !== undefined;

  useEffect(() => {
    if (initialNote) {
      setNote(initialNote);
    }
  }, [initialNote]);

  const handleChange = (field: keyof typeof note, value: string) => {
    setNote((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const endpoint = isEditMode
        ? `/api/jobs/${jobId}/note/${noteIndex}`
        : `/api/jobs/${jobId}/note`;

      const method = isEditMode ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
      });

      if (!res.ok) throw new Error("Failed to save note");

      if (!isEditMode) {
        setNote({
          title: "",
          mood: "",
          date: new Date().toISOString().split("T")[0],
          note: "",
        });
      }
      onNoteAdded?.();
      onSuccess?.();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 mt-4 p-4 border rounded"
    >
      <h4 className="font-semibold">{isEditMode ? "Edit Note" : "Add Note"}</h4>
      <input
        type="text"
        placeholder="Title"
        value={note.title}
        onChange={(e) => handleChange("title", e.target.value)}
        className="border p-2 rounded"
      />
      <textarea
        placeholder="Note content"
        value={note.note}
        onChange={(e) => handleChange("note", e.target.value)}
        className="border p-2 rounded"
      />
      <div className="flex gap-2 items-center">
        <span className="text-sm">Mood:</span>
        {moodEmojis.map((m) => (
          <button
            type="button"
            key={m.emoji}
            onClick={() => handleChange("mood", m.emoji)}
            className={`p-1 ${note.mood === m.emoji ? "bg-blue-200" : ""}`}
          >
            {m.emoji}
          </button>
        ))}
      </div>
      <input
        type="date"
        value={note.date}
        onChange={(e) => handleChange("date", e.target.value)}
        className="border p-2 rounded"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        {isSubmitting ? "Saving..." : isEditMode ? "Update Note" : "Add Note"}
      </button>
      {isEditMode && onCancel && (
        <button
          type="button"
          className="text-sm text-gray-600 hover:underline mt-2"
          onClick={onCancel}
        >
          Cancel
        </button>
      )}
    </form>
  );
}
