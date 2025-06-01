import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { getUserRole } from "../../utils/auth";
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  Divider,
  Skeleton,
  useTheme,
  Tooltip,
  Snackbar,
} from '@mui/material';
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  PlayArrow as EnrollIcon,
} from '@mui/icons-material';

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [msg, setMsg] = useState("");
  const [enrolled, setEnrolled] = useState(false);
  const [enrollMsg, setEnrollMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const userRole = getUserRole();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, assessmentsRes] = await Promise.all([
          API.get(`/courses/${id}`),
          API.get("/assessments")
        ]);
        
        setCourse(courseRes.data);
        const courseAssessments = assessmentsRes.data.filter(a => a.courseId === id);
        setAssessments(courseAssessments);

        if (userRole === "Student") {
          const enrollmentRes = await API.get(`/courses/${id}/enrollment-status`);
          setEnrolled(enrollmentRes.data.enrolled);
        }
      } catch (error) {
        setMsg("Failed to load course data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, userRole]);

  const handleEnroll = async () => {
    try {
      await API.post(`/courses/${id}/enroll`);
      setEnrolled(true);
      setEnrollMsg("Successfully enrolled in the course!");
    } catch (err) {
      let message = "Failed to enroll.";
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (typeof data === "string") message = data;
        else if (data.title) message = data.title;
        else if (data.errors) message = Object.values(data.errors).flat().join(", ");
      }
      setEnrollMsg(message);
    }
  };

  const handleDelete = async (assessmentId) => {
    if (!window.confirm("Are you sure you want to delete this assessment?")) return;
    try {
      await API.delete(`/assessments/${assessmentId}`);
      setAssessments(prev => prev.filter(a => a.assessmentId !== assessmentId));
      setMsg("Assessment deleted successfully");
    } catch (err) {
      setMsg("Failed to delete assessment");
    }
  };

  const handleCloseMsg = () => setMsg("");
  const handleCloseEnrollMsg = () => setEnrollMsg("");

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Skeleton variant="rectangular" height={200} sx={{ mb: 2, borderRadius: 2 }} />
          <Skeleton variant="text" height={60} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={30} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
        </Box>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Alert severity="error">Failed to load course</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {course.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {course.description}
              </Typography>
            </Box>
          </Box>

          {userRole === "Student" && !enrolled && (
            <Button
              variant="contained"
              startIcon={<EnrollIcon />}
              onClick={handleEnroll}
              sx={{ mb: 3, fontWeight: 600 }}
            >
              Enroll in Course
            </Button>
          )}
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" component="h2">
              Assessments
            </Typography>
            {userRole === "Instructor" && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate(`/courses/${id}/assessments/create`)}
                sx={{ fontWeight: 600 }}
              >
                Add Assessment
              </Button>
            )}
          </Box>

          {userRole === "Student" && !enrolled ? (
            <Alert severity="warning" sx={{ mt: 2 }}>
              You must enroll to view assessments
            </Alert>
          ) : (
            <>
              {assessments.length === 0 ? (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 4,
                    color: 'text.secondary',
                  }}
                >
                  <AssignmentIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                  <Typography variant="h6">
                    No assessments available
                  </Typography>
                  <Typography variant="body2">
                    {userRole === "Instructor" 
                      ? "Create your first assessment to get started"
                      : "Check back later for new assessments"}
                  </Typography>
                </Box>
              ) : (
                <List>
                  {assessments.map((assessment, index) => (
                    <React.Fragment key={assessment.assessmentId}>
                      {index > 0 && <Divider />}
                      <ListItem
                        button
                        onClick={() => navigate(`/courses/${id}/assessments/${assessment.assessmentId}`)}
                      >
                        <ListItemText
                          primary={assessment.title}
                          secondary={assessment.description}
                        />
                        {userRole === "Instructor" && (
                          <ListItemSecondaryAction>
                            <Tooltip title="Delete assessment">
                              <IconButton
                                edge="end"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(assessment.assessmentId);
                                }}
                                sx={{ color: 'error.main' }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </ListItemSecondaryAction>
                        )}
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              )}
            </>
          )}
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

        <Snackbar
          open={Boolean(enrollMsg)}
          autoHideDuration={6000}
          onClose={handleCloseEnrollMsg}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseEnrollMsg}
            severity={enrollMsg.includes("Successfully") ? "success" : "error"}
            sx={{ width: '100%' }}
          >
            {enrollMsg}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}
