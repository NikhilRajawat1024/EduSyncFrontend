import React, { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  useTheme,
  Link,
} from '@mui/material';
import { Email as EmailIcon } from '@mui/icons-material';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    try {
      await API.post("/auth/forgot-password", { email });
      setMsg("Reset link sent! Check your email.");
      setSent(true);
    } catch (err) {
      setMsg(err?.response?.data || "Failed to send reset email.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: theme.palette.primary.main,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <EmailIcon sx={{ color: 'white', fontSize: 32 }} />
          </Box>

          <Typography variant="h4" component="h1" gutterBottom>
            Forgot Password
          </Typography>

          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Enter your email address and we'll send you a link to reset your password.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              name="email"
              type="email"
              label="Email Address"
              variant="outlined"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={sent}
              sx={{ mb: 2 }}
            >
              {sent ? 'Reset Link Sent' : 'Send Reset Link'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/login")}
                sx={{
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Back to Login
              </Link>
            </Box>
          </Box>

          {msg && (
            <Alert 
              severity={sent ? "success" : "error"} 
              sx={{ mt: 2, width: '100%' }}
            >
              {msg}
            </Alert>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
