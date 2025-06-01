import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
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
  useTheme,
  Tooltip,
  Chip,
  Snackbar,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

export default function InstructorAssessments() {
  const [assessments, setAssessments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await API.get("/courses");
        setCourses(coursesRes.data);
        const courseIds = coursesRes.data.map(c => c.courseId);
        
        const assessmentsRes = await API.get("/assessments");
        setAssessments(
          assessmentsRes.data.filter(a => courseIds.includes(a.courseId))
        );
      } catch (error) {
        setMsg("Failed to load assessments or courses");
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (assessmentId) => {
    if (!window.confirm("Are you sure you want to delete this assessment?")) return;
    try {
      await API.delete(`/assessments/${assessmentId}`);
      setAssessments(prev => prev.filter(a => a.assessmentId !== assessmentId));
      setMsg("Assessment deleted successfully");
    } catch {
      setMsg("Failed to delete assessment");
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Typography variant="h4" component="h1">
                My Assessments
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/courses")}
              sx={{ fontWeight: 600 }}
            >
              Create Assessment
            </Button>
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
                No assessments created yet
              </Typography>
              <Typography variant="body2">
                Create your first assessment by selecting a course
              </Typography>
            </Box>
          ) : (
            <List>
              {assessments.map((assessment, index) => (
                <React.Fragment key={assessment.assessmentId}>
                  {index > 0 && <Divider />}
                  <ListItem
                    button
                    onClick={() => navigate(`/assessments/${assessment.assessmentId}`)}
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
                            icon={<SchoolIcon />}
                            label={courses.find(c => c.courseId === assessment.courseId)?.title || ""}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ mr: 1 }}
                          />
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title="Edit assessment">
                        <IconButton
                          edge="end"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/courses/${assessment.courseId}/assessments/${assessment.assessmentId}/edit`);
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
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
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
      </Box>
    </Container>
  );
}
