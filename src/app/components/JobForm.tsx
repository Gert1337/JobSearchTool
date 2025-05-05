"use client";
import { useState } from "react";
import { Note, Company } from "@/components/types";

import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { jobsAtom } from "@/(atoms)/atoms";

interface JobFormProps {
  companies: Company[];
  onClose: () => void;
}

const moodEmojis = [
  { label: "Happy", emoji: "😊" },
  { label: "Sad", emoji: "😢" },
  { label: "Excited", emoji: "😄" },
  { label: "Angry", emoji: "😠" },
  { label: "Neutral", emoji: "😐" },
  { label: "Surprised", emoji: "😲" },
];

const JobForm = ({ companies, onClose }: JobFormProps) => {
  const [jobTitle, setJobTitle] = useState<string>("");
  const [, setJobs] = useAtom(jobsAtom);
  const [companyId, setCompanyId] = useState<string>("");
  const [status, setStatus] = useState<
    "applied" | "interviewing" | "offer" | "rejected"
  >("applied");
  const [dateApplied, setDateApplied] = useState<string>("");
  const [notes, setNotes] = useState<Note[]>([
    {
      title: "",
      mood: "",
      date: new Date().toISOString().split("T")[0],
      note: "",
    },
  ]); // Initialize with one empty note
  const router = useRouter();

  const handleNoteChange = (index: number, key: keyof Note, value: string) => {
    const updatedNotes = [...notes];
    updatedNotes[index][key] = value;
    setNotes(updatedNotes);
  };

  const handleMoodChange = (index: number, emoji: string) => {
    handleNoteChange(index, "mood", emoji);
  };

  const handleAddNote = () => {
    setNotes([
      ...notes,
      {
        title: "",
        mood: "",
        date: new Date().toISOString().split("T")[0],
        note: "",
      },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newJob = {
      title: jobTitle,
      companyId,
      status: status,
      dateApplied: dateApplied,
      notes: notes,
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
        const company = companies.find((c) => c._id === responseData.company);
        const enrichedJob = {
          ...responseData,
          company: company ? company.name : "Unknown company",
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setJobs((prevJobs: any) => [...prevJobs, enrichedJob]);

        // Clear form
        setJobTitle("");
        setCompanyId("");
        setStatus("applied");
        setNotes([
          {
            title: "",
            mood: "",
            date: new Date().toISOString().split("T")[0],
            note: "",
          },
        ]);
        onClose();
        router.push("/");
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
      className="flex flex-col gap-3 p-6 rounded-md "
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
        <label htmlFor="companyId" className="text-sm font-medium mb-2">
          Company
        </label>
        <select
          id="companyId"
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          required
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="">Select a Company</option>
          {companies.map((company) => (
            <option
              key={company._id?.toString()}
              value={company._id?.toString()}
            >
              {company.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="status" className="text-sm font-medium mb-2">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value as
                | "applied"
                | "interviewing"
                | "offer"
                | "rejected"
            )
          }
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="applied">Applied</option>
          <option value="interviewing">Interviewing</option>
          <option value="rejected">Rejected</option>
          <option value="offer">Offer</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="dateApplied" className="text-sm font-medium mb-2">
          Date Applied
        </label>
        <input
          type="date"
          id="dateApplied"
          value={dateApplied}
          onChange={(e) => setDateApplied(e.target.value)}
          required
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Notes */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-2">Notes</label>
        {notes.map((note, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              placeholder="Note Title"
              value={note.title}
              onChange={(e) => handleNoteChange(index, "title", e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full mb-2"
            />
            <div className="flex gap-2">
              <p>Select Mood:</p>
              {moodEmojis.map((mood) => (
                <button
                  key={mood.emoji}
                  type="button"
                  onClick={() => handleMoodChange(index, mood.emoji)}
                  className={`p-2 ${
                    note.mood === mood.emoji ? "bg-blue-200" : ""
                  }`}
                >
                  {mood.emoji}
                </button>
              ))}
            </div>
            <input
              type="date"
              value={note.date}
              onChange={(e) => handleNoteChange(index, "date", e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full mb-2"
            />
            <textarea
              placeholder="Note content"
              value={note.note}
              onChange={(e) => handleNoteChange(index, "note", e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full mb-2"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddNote}
          className="bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 transition-colors"
        >
          Add a Note
        </button>
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
