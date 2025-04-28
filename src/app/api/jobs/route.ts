import { createJob, listJobs, deleteJob } from "@/lib/jobs"

export async function POST(req: Request) {
	const data = await req.json();

	const newJob = await createJob({
		title: data.title,
		company: data.company,
		status: data.status,
		notes: data.notes,
	});

	return new Response(JSON.stringify(newJob), {
		status: 201,
	});
}

export async function GET() {
	const jobs = await listJobs();
	return new Response(JSON.stringify(jobs), {
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
		await deleteJob(id);
		return new Response(null, { status: 204 }); // 204 No Content
	} catch (error) {
		console.error("Failed to delete job:", error); 
		return new Response(JSON.stringify({ error: "Failed to delete job" }), {
			status: 500,
		});
	}
}