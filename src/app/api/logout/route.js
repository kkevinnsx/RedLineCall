import { NextResponse } from "next/server";
import { destroySession } from "@/modules/auth/services/authService";

export async function POST(req) {
    try {
        await destroySession(req); 
        return NextResponse.json({ message: 'Logout successful' });
    } catch (error) {
        return NextResponse.json({ message: 'Logout failed' }, { status: 500 });
    }
}
