import { createJob, listJobs } from "@/lib/jobs"

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