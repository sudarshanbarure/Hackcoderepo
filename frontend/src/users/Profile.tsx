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
import Grid from "@mui/material/Grid2";
import Layout from "../components/Layout";
import apiClient from "../api/apiClient";

type RouteParams = { id?: string; userId?: string };

export default function Profile() {
  const { id, userId } = useParams<RouteParams>();
  const effectiveUserId = userId ?? id;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = effectiveUserId
        ? await apiClient.get(`/users/${effectiveUserId}`)
        : await apiClient.get("/users/me");
      setProfile(res.data?.data || res.data);
      setLoading(false);
    };
    load();
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

  return (
    <Layout>
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box textAlign="center">
              <Avatar sx={{ width: 96, height: 96, mx: "auto", mb: 2 }}>
                {profile.firstName?.[0]}
              </Avatar>
              <Typography variant="h6">
                {profile.firstName} {profile.lastName}
              </Typography>
              <Chip label={profile.role?.name || profile.role} />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="First Name" value={profile.firstName} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Last Name" value={profile.lastName} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Email" value={profile.email} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Divider />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box display="flex" justifyContent="flex-end">
                  <Button variant="contained">Save</Button>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Layout>
  );
}
