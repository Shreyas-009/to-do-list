import { useState, useEffect } from "react";

const API_URL = "https://to-do-list-backend-rust.vercel.app/api";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await fetch(`${API_URL}/tasks`);
    const data = await response.json();
    setTasks(data);
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, dueDate, completed: false }),
    });
    const newTask = await response.json();
    setTasks([...tasks, newTask]);
    setTitle("");
    setDueDate("");
  };

  const toggleTask = async (id) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    const updatedTask = {
      ...taskToUpdate,
      completed: !taskToUpdate.completed,
    };

    await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
    });
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-purple-500">
          Todo List with Status
        </h1>

        {/* Add Task Form */}
        <form
          onSubmit={addTask}
          className="mb-8 bg-zinc-800 p-6 rounded-lg shadow-lg"
        >
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="bg-zinc-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-zinc-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition duration-200"
            >
              Add Task
            </button>
          </div>
        </form>

        {/* Task List */}
        <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
          {tasks.length === 0 ? (
            <p className="text-center text-gray-400">
              No tasks yet. Add one above!
            </p>
          ) : (
            <ul className="space-y-4">
              {tasks.map((task, index) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between bg-zinc-700 p-4 rounded"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-400">{index + 1}.</span>
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="w-6 h-6 border-2 border-purple-500 rounded-full flex items-center justify-center"
                    >
                      {task.completed && (
                        <div className="w-4 h-4 bg-purple-500 rounded-full" />
                      )}
                    </button>
                    <div>
                      <span
                        className={`${
                          task.completed
                            ? "line-through text-gray-400"
                            : "text-white"
                        }`}
                      >
                        {task.title}
                      </span>
                      <p className="text-sm text-gray-400">
                        Due: {task.dueDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`${
                        task.completed ? "text-green-500" : "text-yellow-500"
                      }`}
                    >
                      {task.completed ? "Done" : "Pending"}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 hover:text-red-600 transition duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
