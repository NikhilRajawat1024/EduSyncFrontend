import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import { getUserRole } from "../../utils/auth";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Alert,
  Snackbar,
  useTheme,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

export default function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const role = getUserRole();
  const theme = useTheme();

  useEffect(() => {
    API.get("/courses")
      .then(res => setCourses(res.data))
      .catch(() => setCourses([]));
  }, []);

  // Delete course
  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await API.delete(`/courses/${courseId}`);
      setCourses(courses.filter(c => c.courseId !== courseId));
      setMsg("Course deleted successfully");
    } catch {
      setMsg("Failed to delete course");
    }
  };

  const handleCloseMsg = () => setMsg("");

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SchoolIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" component="h1">
              All Courses
            </Typography>
          </Box>
          {role === "Instructor" && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/courses/create")}
              sx={{ fontWeight: 600 }}
            >
              Create Course
            </Button>
          )}
        </Paper>

        <Grid container spacing={3}>
          {courses.map(course => (
            <Grid item xs={12} sm={6} md={4} key={course.courseId}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate(`/courses/${course.courseId}`)}>
                  <Typography variant="h6" gutterBottom component="h2">
                    {course.title}
                  </Typography>
                  {course.description && (
                    <Typography variant="body2" color="text.secondary">
                      {course.description}
                    </Typography>
                  )}
                </CardContent>
                {role === "Instructor" && (
                  <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                    <Tooltip title="Edit course">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/courses/${course.courseId}/edit`)}
                        sx={{ color: 'primary.main' }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete course">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(course.courseId)}
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>

        {courses.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              color: 'text.secondary',
            }}
          >
            <SchoolIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6">
              No courses available
            </Typography>
            <Typography variant="body2">
              {role === "Instructor" ? "Create your first course to get started" : "Check back later for new courses"}
            </Typography>
          </Box>
        )}

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
