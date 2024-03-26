import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
    const data  = await request.formData()
    const file:File |null = data.get('image') as unknown as File
  
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
}