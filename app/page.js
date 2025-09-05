"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      let url = "/api/tasks";
      if (search || statusFilter) {
        const params = new URLSearchParams();
        if (search) params.append("q", search);
        if (statusFilter) params.append("status", statusFilter);
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search, statusFilter]);

  // Add new task
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, status: "pending" }),
      });
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Update task status
  const updateStatus = async (id, status) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        Task Manager
      </h1>

      {/* Add Task Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto mb-6 p-6 bg-white rounded shadow space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-700">Add New Task</h2>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <textarea
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        ></textarea>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Task
        </button>
      </form>

      {/* Search & Filter */}
      <div className="max-w-3xl mx-auto mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In-Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Tasks Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No tasks found 📝
          </p>
        )}
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white rounded shadow p-4 flex flex-col justify-between"
          >
            <div>
              <h2 className="font-semibold text-lg text-gray-800">
                {task.title}
              </h2>
              <p className="text-gray-600 mt-1">{task.description}</p>
              <p
                className={`mt-2 text-sm font-semibold ${
                  task.status === "completed"
                    ? "text-green-600"
                    : task.status === "in-progress"
                    ? "text-yellow-600"
                    : "text-gray-600"
                }`}
              >
                {task.status}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => updateStatus(task._id, "pending")}
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-xs"
              >
                Pending
              </button>
              <button
                onClick={() => updateStatus(task._id, "in-progress")}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs"
              >
                In-Progress
              </button>
              <button
                onClick={() => updateStatus(task._id, "completed")}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
              >
                Complete
              </button>
              <button
                onClick={() => deleteTask(task._id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


