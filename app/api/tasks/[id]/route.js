import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";

// GET one task by ID
export async function GET(req, { params }) {
  await connectDB();
  try {
    const task = await Task.findById(params.id);
    if (!task) {
      return new Response(JSON.stringify({ error: "Task not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify(task), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

// UPDATE task by ID
export async function PUT(req, { params }) {
  await connectDB();
  try {
    const body = await req.json();
    const task = await Task.findByIdAndUpdate(params.id, body, { new: true });

    if (!task) {
      return new Response(JSON.stringify({ error: "Task not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify(task), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

// DELETE task by ID
export async function DELETE(req, { params }) {
  await connectDB();
  try {
    const task = await Task.findByIdAndDelete(params.id);

    if (!task) {
      return new Response(JSON.stringify({ error: "Task not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ message: "Task deleted successfully" }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
