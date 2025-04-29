import { createJob, listJobs, deleteJob } from "@/lib/jobs";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const data = await req.json();

  const newJob = await createJob({
    title: data.title,
    company: data.companyId,
    status: data.status,
    notes: data.notes,
	dateApplied: data.dateApplied
  });

  return new Response(JSON.stringify(newJob), {
    status: 201,
  });
}

export async function GET() {
  const jobs = await listJobs();

  // Map jobs and convert _id to a string
  const serializedJobs = jobs.map((job) => ({
    ...job,
    _id: job._id?.toString(), // Ensure _id is always a string
  }));

  return new Response(JSON.stringify(serializedJobs), {
    status: 200,
  });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing ID" }), {
      status: 400,
    });
  }

  try {
    // Convert the id to ObjectId if necessary
    const objectId = ObjectId.isValid(id) ? new ObjectId(id) : null;

    if (!objectId) {
      return new Response(JSON.stringify({ error: "Invalid ID format" }), {
        status: 400,
      });
    }

    // Convert ObjectId to string before passing to deleteJob
    await deleteJob(objectId.toString());  // Pass string ID to deleteJob
    return new Response(null, { status: 204 }); // 204 No Content
  } catch (error) {
    console.error("Failed to delete job:", error);
    return new Response(JSON.stringify({ error: "Failed to delete job" }), {
      status: 500,
    });
  }
}