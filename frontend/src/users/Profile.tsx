import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  TextField,
  Typography,
  Alert,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Layout from "../components/Layout";
import apiClient from "../api/apiClient";

type RouteParams = {
  id?: string;
  userId?: string;
};

type UserProfile = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

export default function Profile() {
  const { id, userId } = useParams<RouteParams>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const effectiveUserId = userId ?? id;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = effectiveUserId
          ? await apiClient.get(`/users/${effectiveUserId}`)
          : await apiClient.get("/users/me");

        const u = res.data?.data || res.data;
        setProfile({
          id: u.id,
          username: u.username,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          role: u.role?.name || u.role,
        });
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [effectiveUserId]);

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <Typography textAlign="center">Profile not found</Typography>
      </Layout>
    );
  }

  return (
    <Layout>
      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Avatar sx={{ width: 96, height: 96, mx: "auto", mb: 2 }}>
                {profile.firstName[0]}
              </Avatar>
              <Typography variant="h6">
                {profile.firstName} {profile.lastName}
              </Typography>
              <Chip label={profile.role} sx={{ mt: 1 }} />
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="First name" value={profile.firstName} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Last name" value={profile.lastName} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Email" value={profile.email} />
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end">
                  <Button variant="contained">Save changes</Button>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Layout>
  );
}
