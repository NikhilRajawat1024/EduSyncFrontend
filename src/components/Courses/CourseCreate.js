import React, { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
  useTheme,
} from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';

export default function CourseCreate() {
  const [form, setForm] = useState({ title: "", description: "", mediaUrl: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  // Extract instructorId from JWT
  let instructorId = "";
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      instructorId =
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
        decoded["sub"] ||
        "";
    } catch {
      instructorId = "";
    }
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!instructorId) {
      setMsg("InstructorId not found in token. Please re-login as an Instructor.");
      return;
    }
    try {
      await API.post("/courses", {
        title: form.title,
        description: form.description,
        mediaUrl: form.mediaUrl,
        instructorId: instructorId,
      });
      setMsg("Course created successfully!");
      setTimeout(() => navigate("/courses"), 1200);
    } catch (err) {
      let message = "Failed to create course.";
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (typeof data === "string") message = data;
        else if (data.title) message = data.title;
        else if (data.errors) message = Object.values(data.errors).flat().join(", ");
      }
      setMsg(message);
    }
  };

  const handleCloseMsg = () => setMsg("");

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <SchoolIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" component="h1">
              Create Course
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              required
              label="Course Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              sx={{ mb: 3 }}
              placeholder="Enter the course title"
              variant="outlined"
            />

            <TextField
              fullWidth
              required
              multiline
              rows={4}
              label="Course Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              sx={{ mb: 3 }}
              placeholder="Describe your course content and objectives"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Media URL (optional)"
              name="mediaUrl"
              value={form.mediaUrl}
              onChange={handleChange}
              sx={{ mb: 4 }}
              placeholder="Add a link to course media content"
              variant="outlined"
              helperText="Add links to videos, presentations, or other course materials"
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  py: 1.5,
                  px: 4,
                  fontWeight: 600,
                }}
              >
                Create Course
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/courses")}
                sx={{
                  py: 1.5,
                  px: 4,
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>

        <Snackbar
          open={Boolean(msg)}
          autoHideDuration={6000}
          onClose={handleCloseMsg}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseMsg}
            severity={msg.includes("success") ? "success" : "error"}
            sx={{ width: '100%' }}
          >
            {msg}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}
