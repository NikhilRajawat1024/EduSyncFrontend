import React, { useState } from "react";
import API from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Snackbar,
  useTheme,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Add as AddIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

export default function AssessmentCreate() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [form, setForm] = useState({
    title: "",
    maxScore: "",
    questions: []
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOption: "A"
  });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const addQuestion = () => {
    if (
      !currentQuestion.questionText ||
      !currentQuestion.optionA ||
      !currentQuestion.optionB ||
      !currentQuestion.optionC ||
      !currentQuestion.optionD ||
      !currentQuestion.correctOption
    ) {
      setError("Please fill out all fields for the question.");
      return;
    }
    setForm(prevForm => ({
      ...prevForm,
      questions: [...prevForm.questions, { ...currentQuestion }]
    }));
    setCurrentQuestion({
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctOption: "A"
    });
    setError("");
    setMsg("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (e) => {
    setCurrentQuestion({ ...currentQuestion, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    if (form.questions.length === 0) {
      setError("Please add at least one question.");
      return;
    }
    try {
      await API.post("/assessments", {
        title: form.title,
        maxScore: Number(form.maxScore),
        courseId: courseId,
        questions: form.questions
      });
      setMsg("Assessment created successfully!");
      setTimeout(() => navigate(`/courses/${courseId}`), 1200);
    } catch (err) {
      let message = "Failed to create assessment.";
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (typeof data === "string") message = data;
        else if (data.title) message = data.title;
        else if (data.errors) message = Object.values(data.errors).flat().join(", ");
      }
      setError(message);
    }
  };

  const handleCloseMsg = () => setMsg("");
  const handleCloseError = () => setError("");

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
              Create MCQ Assessment
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              required
              label="Assessment Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              sx={{ mb: 3 }}
              placeholder="Enter assessment title"
              variant="outlined"
            />

            <TextField
              fullWidth
              required
              label="Max Score"
              name="maxScore"
              type="number"
              inputProps={{ min: 1 }}
              value={form.maxScore}
              onChange={handleChange}
              sx={{ mb: 4 }}
              placeholder="Enter maximum score"
              variant="outlined"
            />

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
              Add MCQ Question
            </Typography>

            <TextField
              fullWidth
              label="Question"
              name="questionText"
              value={currentQuestion.questionText}
              onChange={handleQuestionChange}
              sx={{ mb: 3 }}
              placeholder="Enter your question"
              variant="outlined"
              multiline
              rows={2}
            />

            <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                label="Option A"
                name="optionA"
                value={currentQuestion.optionA}
                onChange={handleQuestionChange}
                placeholder="Enter option A"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Option B"
                name="optionB"
                value={currentQuestion.optionB}
                onChange={handleQuestionChange}
                placeholder="Enter option B"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Option C"
                name="optionC"
                value={currentQuestion.optionC}
                onChange={handleQuestionChange}
                placeholder="Enter option C"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Option D"
                name="optionD"
                value={currentQuestion.optionD}
                onChange={handleQuestionChange}
                placeholder="Enter option D"
                variant="outlined"
              />
            </Box>

            <FormControl sx={{ minWidth: 200, mb: 3 }}>
              <InputLabel>Correct Option</InputLabel>
              <Select
                name="correctOption"
                value={currentQuestion.correctOption}
                onChange={handleQuestionChange}
                label="Correct Option"
              >
                <MenuItem value="A">Option A</MenuItem>
                <MenuItem value="B">Option B</MenuItem>
                <MenuItem value="C">Option C</MenuItem>
                <MenuItem value="D">Option D</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ mb: 4 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addQuestion}
                sx={{ fontWeight: 600 }}
              >
                Add Question
              </Button>
            </Box>

            {form.questions.length > 0 && (
              <Paper
                variant="outlined"
                sx={{ mb: 4, borderRadius: 1 }}
              >
                <List>
                  {form.questions.map((q, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <Divider />}
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1">
                              <strong>Q{idx + 1}.</strong> {q.questionText}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 1, color: 'text.secondary' }}>
                              <Typography variant="body2" component="span">
                                A: {q.optionA} | B: {q.optionB} | C: {q.optionC} | D: {q.optionD}
                              </Typography>
                              <Typography
                                variant="body2"
                                component="span"
                                sx={{ ml: 1, color: 'primary.main' }}
                              >
                                Correct: {q.correctOption}
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

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={form.questions.length === 0}
              startIcon={<SaveIcon />}
              sx={{ py: 1.5, fontWeight: 600 }}
            >
              Create Assessment
            </Button>
          </Box>
        </Paper>

        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseError}
            severity="error"
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={Boolean(msg)}
          autoHideDuration={6000}
          onClose={handleCloseMsg}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseMsg}
            severity="success"
            sx={{ width: '100%' }}
          >
            {msg}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}
