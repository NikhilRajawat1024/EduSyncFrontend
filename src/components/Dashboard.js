import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  useTheme,
  Avatar,
  Paper,
  Container,
} from '@mui/material';
import {
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  MenuBook as MenuBookIcon,
  Group as GroupIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import API from "../services/api";

const DashboardCard = ({ title, description, icon, onClick, color }) => {
  const theme = useTheme();
  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        }
      }}
    >
      <CardActionArea 
        onClick={onClick}
        sx={{ height: '100%', p: 2 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: `${color}.main`,
              width: 48,
              height: 48,
            }}
          >
            {icon}
          </Avatar>
        </Box>
        <Typography variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardActionArea>
    </Card>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    if (!role) {
      navigate("/login");
    } else {
      setRole(role);
      setName(name);
      setEmail(email);

      if (role === "Student") {
        API.get("/courses/enrolled")
          .then(res => setEnrolledCourses(res.data))
          .catch(console.error);
      }
    }
  }, [navigate]);

  const getStudentDashboardItems = () => [
    {
      title: "Courses",
      description: "Browse and enroll in available courses",
      icon: <SchoolIcon />,
      path: "/courses",
      color: "primary"
    },
    {
      title: "My Courses",
      description: "View your enrolled courses",
      icon: <MenuBookIcon />,
      path: "/my-courses",
      color: "secondary"
    },
    {
      title: "Assessments",
      description: "View and take your assessments",
      icon: <AssessmentIcon />,
      path: "/assessments",
      color: "success"
    },
    {
      title: "Results",
      description: "Check your assessment results",
      icon: <MenuBookIcon />,
      path: "/results",
      color: "info"
    },
    {
      title: "Profile",
      description: "View and update your profile",
      icon: <PersonIcon />,
      path: "/profile",
      color: "warning"
    }
  ];

  const getInstructorDashboardItems = () => [
    {
      title: "Courses",
      description: "Manage your courses",
      icon: <SchoolIcon />,
      path: "/courses",
      color: "primary"
    },
    {
      title: "Create Course",
      description: "Create a new course",
      icon: <AddIcon />,
      path: "/courses/create",
      color: "secondary"
    },
    {
      title: "Results",
      description: "View student assessment results",
      icon: <MenuBookIcon />,
      path: "/results",
      color: "success"
    },
    {
      title: "Profile",
      description: "View and update your profile",
      icon: <PersonIcon />,
      path: "/profile",
      color: "info"
    }
  ];

  const dashboardItems = role === "Student" ? getStudentDashboardItems() : getInstructorDashboardItems();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            mb: 4, 
            background: theme.palette.primary.main,
            color: 'white',
            borderRadius: 2
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome back, {name}!
          </Typography>
          <Typography variant="subtitle1">
            • {role}
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          {dashboardItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <DashboardCard
                title={item.title}
                description={item.description}
                icon={item.icon}
                onClick={() => navigate(item.path)}
                color={item.color}
              />
            </Grid>
          ))}
        </Grid>

        {role === "Student" && enrolledCourses.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" gutterBottom>
              Your Enrolled Courses
            </Typography>
            <Grid container spacing={3}>
              {enrolledCourses.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course.id}>
                  <Card>
                    <CardActionArea onClick={() => navigate(`/courses/${course.id}`)}>
                      <CardContent>
                        <Typography variant="h6" component="h2" gutterBottom>
                          {course.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {course.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default Dashboard;
