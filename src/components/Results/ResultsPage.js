import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { getUserRole } from "../../utils/auth";
import {
  Container,
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  useTheme,
  Chip,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Score as ScoreIcon,
} from '@mui/icons-material';

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState("");
  const role = getUserRole();
  const theme = useTheme();

  useEffect(() => {
    API.get("/results")
      .then(res => setResults(res.data))
      .catch(() => setMsg("Failed to load results"));

    API.get("/assessments")
      .then(res => setAssessments(res.data))
      .catch(() => setAssessments([]));

    if (role === "Instructor") {
      API.get("/users")
        .then(res => setUsers(res.data))
        .catch(() => setUsers([]));
    }
  }, [role]);

  const getAssessmentTitle = (id) => {
    const assessment = assessments.find(a => a.assessmentId === id);
    return assessment ? assessment.title : "Assessment";
  };

  const getStudentName = (userId) => {
    const user = users.find(u => u.userId === userId);
    return user ? user.name : userId;
  };

  const parseUtc = (dt) => {
    if (!dt) return "";
    if (dt.endsWith("Z")) return new Date(dt);
    if (dt.includes("T")) return new Date(dt + "Z");
    return new Date(dt.replace(" ", "T") + "Z");
  };

  return (
    <Container maxWidth="lg">
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
            <AssessmentIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" component="h1">
              {role === "Instructor" ? "Student Results" : "My Assessment Results"}
            </Typography>
          </Box>

          {msg && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {msg}
            </Alert>
          )}

          {results.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 4,
                color: 'text.secondary',
              }}
            >
              <ScoreIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6">
                No results available
              </Typography>
              <Typography variant="body2">
                {role === "Instructor" 
                  ? "No students have completed any assessments yet"
                  : "Complete some assessments to see your results here"}
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {role === "Instructor" && (
                      <TableCell>
                        <Typography variant="subtitle2">Student Name</Typography>
                      </TableCell>
                    )}
                    <TableCell>
                      <Typography variant="subtitle2">Assessment</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">Score</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">Date (IST)</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map(r => (
                    <TableRow key={r.resultId} hover>
                      {role === "Instructor" && (
                        <TableCell>{getStudentName(r.userId)}</TableCell>
                      )}
                      <TableCell>{getAssessmentTitle(r.assessmentId)}</TableCell>
                      <TableCell>
                        <Chip
                          label={r.score}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {parseUtc(r.attemptDate).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit"
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
