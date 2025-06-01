import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
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
  Chip,
  Alert,
  CircularProgress,
  Divider,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Stars as StarsIcon,
} from '@mui/icons-material';

export default function AssessmentList() {
  const { courseId } = useParams();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const userRole = getUserRole();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await API.get(`/courses/${courseId}/assessments`);
        setAssessments(response.data);
      } catch (err) {
        setError("Failed to load assessments. Please try again.");
        console.error("Error loading assessments:", err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchAssessments();
    }
  }, [courseId]);

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

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading assessments...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Alert severity="error" variant="filled">
            {error}
          </Alert>
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
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Typography variant="h4" component="h1">
                Course Assessments
              </Typography>
            </Box>
            {userRole === "Instructor" && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate(`/courses/${courseId}/assessments/create`)}
                sx={{ fontWeight: 600 }}
              >
                Create Assessment
              </Button>
            )}
          </Box>

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
                    onClick={() => navigate(`/courses/${courseId}/assessments/${assessment.assessmentId}`)}
                    sx={{
                      py: 2,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="h6" component="div" gutterBottom>
                          {assessment.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          {assessment.description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              {assessment.description}
                            </Typography>
                          )}
                          <Chip
                            icon={<StarsIcon />}
                            label={`${assessment.maxScore} points`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      }
                    />
                    {userRole === "Instructor" && (
                      <ListItemSecondaryAction>
                        <Tooltip title="Edit assessment">
                          <IconButton
                            edge="end"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/courses/${courseId}/assessments/${assessment.assessmentId}/edit`);
                            }}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
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
        </Paper>

        {msg && (
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
        )}
      </Box>
    </Container>
  );
}
