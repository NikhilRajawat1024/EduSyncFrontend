import React, { useEffect, useState } from "react";
import API from "../../services/api";
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
  useTheme,
  Chip,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

export default function EnrolledStudents() {
  const [students, setStudents] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    API.get("/courses/enrolled-students")
      .then(res => setStudents(res.data));
  }, []);

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
            <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" component="h1">
              All Enrolled Students
            </Typography>
          </Box>

          {students.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 4,
                color: 'text.secondary',
              }}
            >
              <PeopleIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6">
                No students enrolled yet
              </Typography>
              <Typography variant="body2">
                Students will appear here when they enroll in your courses
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle2">Name</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">Email</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">Course</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map(s => (
                    <TableRow key={s.userId + s.courseId} hover>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>{s.email}</TableCell>
                      <TableCell>
                        <Chip
                          icon={<SchoolIcon />}
                          label={s.courseTitle}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
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
