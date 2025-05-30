import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/mongodb";
import Todo from "@/app/models/Todo.js";


export async function GET(request, context) {
    try {
        const { id } = await context.params
        await connectToDatabase()
    } catch (error) {
        
    }
}