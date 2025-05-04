import { NextResponse } from "next/server";
import { deleteDistinctNoteFromJob } from "@/lib/jobs";

export async function DELETE(
	req: Request,
	context: { params: { id: string; index: string } }
) {
	const { id, index } = await context.params;

	try {
		const result = await deleteDistinctNoteFromJob(id, parseInt(index));
		return NextResponse.json(result);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		return NextResponse.json(
			{ error: error.message || "Failed to delete note" },
			{ status: 500 }
		);
	}
}