import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";

const TodoList = () => {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [status, setStatus] = useState(false);

  // 🔹 Fetch Todos
  const fetchTodos = async () => {
    const res = await axios.get("http://localhost:5000/csbs/gettodo");
    setTodos(res.data);
  };

  // 🔹 Add / Update Todo
  const handleSubmit = async () => {
    if (editId) {
      await axios.put(
        `http://localhost:5000/csbs/updatetodo/${editId}`,
        { todo }
      );
      setEditId(null);
    } else {
      await axios.post("http://localhost:5000/csbs/addtodo", { todo });
    }

    setTodo("");
    setStatus(true);
    fetchTodos();
    setTimeout(() => setStatus(false), 2000);
  };

  // 🔹 Delete Todo
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/csbs/deletetodo/${id}`);
    fetchTodos();
  };

  // 🔹 Edit Todo
  const handleEdit = (item) => {
    setTodo(item.todo);
    setEditId(item._id);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <Typography variant="h3">Todo App</Typography>

      <Box sx={{ width: 600, marginTop: 3 }}>
        <TextField
          fullWidth
          label="Enter Todo"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <Button
          variant="contained"
          sx={{ marginTop: 2 }}
          onClick={handleSubmit}
        >
          {editId ? "Update Todo" : "Add Todo"}
        </Button>
      </Box>

      {status && (
        <Alert
          icon={<CheckIcon />}
          severity="success"
          sx={{ position: "fixed", top: 20, right: 20 }}
        >
          Todo Saved Successfully
        </Alert>
      )}

      <ul>
        {todos.map((item) => (
          <li key={item._id}>
            <Typography variant="h6">{item.todo}</Typography>
            <Button onClick={() => handleEdit(item)}>Edit</Button>
            <Button color="error" onClick={() => handleDelete(item._id)}>
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
