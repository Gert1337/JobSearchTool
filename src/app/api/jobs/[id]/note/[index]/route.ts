import { NextResponse } from "next/server";
import { deleteDistinctNoteFromJob, editNoteOnJob } from "@/lib/jobs";

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
export async function PATCH(
	req: Request,
	context: { params: { id: string; index: string } }
) {
	const { id, index } = context.params;
	const body = await req.json();

	try {
		const result = await editNoteOnJob(id, parseInt(index), body);
		return NextResponse.json(result);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		return NextResponse.json(
			{ error: error.message || "Failed to edit note" },
			{ status: 500 }
		);
	}
}