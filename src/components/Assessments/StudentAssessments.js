import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
  Divider,
  useTheme,
  Chip,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

export default function StudentAssessments() {
  const [assessments, setAssessments] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await API.get("/courses/enrolled");
        const ids = courseRes.data.map(c => c.courseId);
        
        const assessRes = await API.get("/assessments");
        const userAssessments = assessRes.data.filter(a =>
          ids.includes(a.courseId)
        );
        setAssessments(userAssessments);
      } catch (error) {
        setMsg("Failed to load assessments or enrolled courses");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>
            Loading your assessments...
          </Typography>
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" component="h1">
              My Assessments
            </Typography>
          </Box>

          {msg && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {msg}
            </Alert>
          )}

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
                No assessments assigned yet
              </Typography>
              <Typography variant="body2">
                Check back later for new assessments from your enrolled courses
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
                        assessment.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            {assessment.description}
                          </Typography>
                        )
                      }
                    />
                    <Chip
                      icon={<SchoolIcon />}
                      label={`${assessment.maxScore} points`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
