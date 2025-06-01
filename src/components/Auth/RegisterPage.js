import React, { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Avatar,
  useTheme,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", passwordHash: "" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name === 'password' ? 'passwordHash' : name]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    setError("");
    try {
      await API.post("/auth/register", { ...form, role: "Student" });
      setMsg("Registration successful! Please log in.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      if (err.response) {
        if (err.response.data && err.response.data.errors) {
          const errorMessages = Object.values(err.response.data.errors).flat();
          setError(errorMessages.join(", "));
        } else if (err.response.data && typeof err.response.data === 'string') {
          setError(err.response.data);
        } else if (err.response.data && err.response.data.title) {
          setError(err.response.data.title);
        } else {
          setError("Registration failed. Please try again.");
        }
      } else if (err.request) {
        setError("No response from server. Please try again later.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <PersonAddIcon />
          </Avatar>
          <Typography component="h1" variant="h5" gutterBottom>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Join EduSync to start learning
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={form.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={form.passwordHash}
              onChange={handleChange}
              inputProps={{ minLength: 6 }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                py: 1.5,
                mb: 2,
                fontWeight: 600,
              }}
            >
              Create Account
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/login")}
                sx={{ textDecoration: 'none' }}
              >
                Already have an account? Sign in
              </Link>
            </Box>

            {msg && (
              <Alert severity="success" sx={{ mt: 3 }}>
                {msg}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {error}
              </Alert>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
