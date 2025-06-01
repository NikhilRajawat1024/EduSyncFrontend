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
  ListItemIcon,
  Divider,
  useTheme,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  School as SchoolIcon,
  MenuBook as MenuBookIcon,
} from '@mui/icons-material';

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    API.get("/courses/enrolled")
      .then(res => setCourses(res.data))
      .catch(() => setCourses([]));
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
            <MenuBookIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" component="h1">
              My Enrolled Courses
            </Typography>
          </Box>

          {courses.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 4,
                color: 'text.secondary',
              }}
            >
              <SchoolIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6">
                No enrolled courses yet
              </Typography>
              <Typography variant="body2">
                Browse available courses and enroll to start learning
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {courses.map(course => (
                <Grid item xs={12} sm={6} md={4} key={course.courseId}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[4],
                      },
                    }}
                    onClick={() => navigate(`/courses/${course.courseId}`)}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <SchoolIcon sx={{ color: 'primary.main', mr: 1 }} />
                        <Typography variant="h6" component="h2">
                          {course.title}
                        </Typography>
                      </Box>
                      {course.description && (
                        <Typography variant="body2" color="text.secondary">
                          {course.description}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
