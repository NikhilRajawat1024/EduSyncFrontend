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
  Link,
  Alert,
  useTheme,
  Avatar,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await API.post("/auth/login", form);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        const decoded = jwtDecode(res.data.token);
        localStorage.setItem("role", decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "");
        localStorage.setItem("name", decoded["name"] || "");
        localStorage.setItem("email", decoded["email"] || "");
        onLogin();
        navigate("/");
      } else {
        setMsg("Invalid login: no token returned.");
      }
    } catch (err) {
      setMsg("Invalid credentials.");
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
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Sign in to continue to EduSync
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
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
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
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
              Sign In
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/register")}
                sx={{ textDecoration: 'none' }}
              >
                Create an account
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/forgot-password")}
                sx={{ textDecoration: 'none' }}
              >
                Forgot password?
              </Link>
            </Box>

            {msg && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {msg}
              </Alert>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
