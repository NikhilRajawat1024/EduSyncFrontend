import React, { useEffect, useState } from "react";
import API from "../services/api";
import { getUserId, getUserRole } from "../utils/auth";
import {
  Container,
  Box,
  Paper,
  Typography,
  Grid,
  Avatar,
  Skeleton,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';

const ProfileField = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
    {React.cloneElement(icon, { sx: { mr: 2, color: 'primary.main' } })}
    <Box>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body1">
        {value}
      </Typography>
    </Box>
  </Box>
);

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const role = getUserRole();
  const theme = useTheme();

  useEffect(() => {
    API.get(`/users/${getUserId()}`)
      .then(res => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        setLoading(false);
      });
  }, []);

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
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'primary.main',
                mr: 3,
              }}
            >
              <PersonIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" gutterBottom>
                {loading ? <Skeleton width={200} /> : user?.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {loading ? <Skeleton width={150} /> : user?.role}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {loading ? (
            <Box sx={{ mt: 3 }}>
              <Skeleton height={60} />
              <Skeleton height={60} />
              <Skeleton height={60} />
            </Box>
          ) : user ? (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ProfileField
                  icon={<PersonIcon />}
                  label="Full Name"
                  value={user.name}
                />
                <ProfileField
                  icon={<EmailIcon />}
                  label="Email Address"
                  value={user.email}
                />
                <ProfileField
                  icon={<BadgeIcon />}
                  label="Role"
                  value={user.role}
                />
              </Grid>
            </Grid>
          ) : (
            <Typography color="error">Failed to load user data</Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
