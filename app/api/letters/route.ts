import { NextResponse } from "next/server"
import { getAllLetterRequests, getLetterRequestsByUserId } from "@/lib/models/letter-model"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    let letters
    if (userId) {
      letters = await getLetterRequestsByUserId(userId)
    } else {
      letters = await getAllLetterRequests()
    }

    return NextResponse.json(letters)
  } catch (error) {
    console.error("Error getting letters:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil data surat" }, { status: 500 })
  }
}
