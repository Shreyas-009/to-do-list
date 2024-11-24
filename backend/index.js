const express = require("express");
const app = express();
const Port = 8080;
const cors = require("cors");

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is working");
});

app.use(cors());
app.use(express.json());

let tasks = [];

app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const task = {
    id: Date.now(),
    title: req.body.title,
    dueDate: req.body.dueDate,
    completed: false,
  };
  tasks.push(task);
  res.status(201).json(task);
});

app.put("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    res.json(task);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

app.delete("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter((t) => t.id !== id);
  res.status(204).send();
});

app.listen(Port, () => {
  console.log(`Server running at http://localhost:${Port}`);
});
