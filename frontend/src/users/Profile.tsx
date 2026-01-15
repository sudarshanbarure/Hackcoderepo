import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Layout from "../components/Layout";
import apiClient from "../api/apiClient";

export default function Profile() {
  const { id, userId } = useParams();
  const effectiveUserId = userId ?? id;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get(effectiveUserId ? `/users/${effectiveUserId}` : "/users/me")
      .then((res) => setProfile(res.data))
      .finally(() => setLoading(false));
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
        <Typography align="center">Profile not found</Typography>
      </Layout>
    );
  }

  return (
    <Layout>
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Avatar sx={{ width: 96, height: 96, mx: "auto" }}>
                {profile.firstName?.[0]}
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
                <TextField fullWidth label="First Name" value={profile.firstName} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Last Name" value={profile.lastName} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Email" value={profile.email} />
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} textAlign="right">
                <Button variant="contained">Save</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Layout>
  );
}
