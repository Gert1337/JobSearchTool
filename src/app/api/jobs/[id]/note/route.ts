import { addNoteToJob } from "@/lib/jobs";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
	const jobId = params.id;
	const note = await req.json();

	try {
		await addNoteToJob(jobId, note);
		return new Response(null, { status: 200 });
	} catch (error) {
		console.error("Error adding note:", error);
		return new Response(JSON.stringify({ error: "Failed to add note" }), {
			status: 500,
		});
	}
}