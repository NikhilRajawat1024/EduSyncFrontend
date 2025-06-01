import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import { getUserRole } from "../../utils/auth";
import {
  Container,
  Box,
  Paper,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Send as SendIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

export default function AssessmentDetail() {
  const { assessmentId } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [alreadyAttempted, setAlreadyAttempted] = useState(false);
  const userRole = getUserRole();
  const theme = useTheme();

  // 1. Check if the user already attempted this assessment
  useEffect(() => {
    const checkAttemptStatus = async () => {
      if (userRole === "Student" && assessmentId) {
        try {
          const res = await API.get(`/assessments/${assessmentId}/attempt-status`);
          if (res.data.attempted) setAlreadyAttempted(true);
          else setAlreadyAttempted(false);
        } catch (err) {
          // Optionally handle error
          setAlreadyAttempted(false);
        }
      }
    };
    checkAttemptStatus();
  }, [assessmentId, userRole]);

  // 2. Fetch assessment data
  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await API.get(`/assessments/${assessmentId}`);
        setAssessment(response.data);
      } catch (err) {
        setError(
          err.response && err.response.status === 404
            ? "Assessment not found (404)."
            : "Failed to load assessment. Please try again."
        );
        console.error("Error loading assessment:", err);
      } finally {
        setLoading(false);
      }
    };

    if (assessmentId) {
      fetchAssessment();
    }
  }, [assessmentId]);

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Check all questions answered
    if (Object.keys(userAnswers).length !== assessment.questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }
    // Confirm payload shape
    console.log("Submitting assessment attempt:", { answers: userAnswers });
    try {
      const response = await API.post(`/assessments/${assessmentId}/attempt`, {
        answers: userAnswers
      });
      setScore(response.data.score);
      setSubmitted(true);
    } catch (err) {
      setError("Failed to submit assessment. Please try again.");
      console.error("Error submitting assessment:", err);
    }
  };

  // Loading and error UI
  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading assessment...</Typography>
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

  // 3. If already attempted and student, show warning instead of assessment
  if (alreadyAttempted && userRole === "Student") {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Alert
            severity="warning"
            icon={<CheckIcon />}
            sx={{ alignItems: 'center' }}
          >
            You have already submitted this assessment.
          </Alert>
        </Box>
      </Container>
    );
  }

  if (!assessment) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Alert severity="warning">
            Assessment not found.
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
            mb: 4,
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {assessment.title}
              </Typography>
              {assessment.description && (
                <Typography variant="body1" color="text.secondary">
                  {assessment.description}
                </Typography>
              )}
            </Box>
          </Box>

          {userRole === "Student" && !submitted ? (
            <Box component="form" onSubmit={handleSubmit}>
              {assessment.questions?.map((question, index) => (
                <Card
                  key={question.questionId}
                  variant="outlined"
                  sx={{ mb: 3, borderRadius: 2 }}
                >
                  <CardContent>
                    <FormControl component="fieldset" sx={{ width: '100%' }}>
                      <FormLabel component="legend" sx={{ mb: 2 }}>
                        <Typography variant="h6">
                          Question {index + 1}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          {question.questionText}
                        </Typography>
                      </FormLabel>
                      <RadioGroup
                        name={`question_${question.questionId}`}
                        value={userAnswers[question.questionId] || ''}
                        onChange={(e) => handleAnswerChange(question.questionId, e.target.value)}
                      >
                        {["A", "B", "C", "D"].map(option => (
                          <FormControlLabel
                            key={option}
                            value={option}
                            control={<Radio />}
                            label={question[`option${option}`]}
                            sx={{
                              mb: 1,
                              p: 1,
                              borderRadius: 1,
                              '&:hover': {
                                bgcolor: 'action.hover',
                              },
                            }}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </CardContent>
                </Card>
              ))}
              <Button
                type="submit"
                variant="contained"
                startIcon={<SendIcon />}
                sx={{ py: 1.5, px: 4, fontWeight: 600 }}
              >
                Submit Assessment
              </Button>
            </Box>
          ) : (
            <Box>
              {score !== null && (
                <Alert
                  severity="info"
                  icon={<CheckIcon />}
                  sx={{
                    mb: 4,
                    alignItems: 'center',
                    '& .MuiAlert-message': {
                      flex: 1,
                    },
                  }}
                >
                  <Typography variant="h6" component="div">
                    Your Score: {score}/{assessment.maxScore}
                  </Typography>
                </Alert>
              )}
              {userRole === "Instructor" && (
                <Paper
                  variant="outlined"
                  sx={{ p: 3, borderRadius: 2 }}
                >
                  <Typography variant="h6" gutterBottom>
                    Assessment Details
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    <strong>Max Score:</strong> {assessment.maxScore}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Questions:
                  </Typography>
                  <List>
                    {assessment.questions?.map((question, index) => (
                      <React.Fragment key={question.questionId}>
                        {index > 0 && <Divider />}
                        <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                <strong>Question {index + 1}:</strong> {question.questionText}
                              </Typography>
                            }
                            secondary={
                              <Box sx={{ ml: 2 }}>
                                <Typography variant="body2" paragraph>
                                  A: {question.optionA}
                                </Typography>
                                <Typography variant="body2" paragraph>
                                  B: {question.optionB}
                                </Typography>
                                <Typography variant="body2" paragraph>
                                  C: {question.optionC}
                                </Typography>
                                <Typography variant="body2">
                                  D: {question.optionD}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
              )}
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
