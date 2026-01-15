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
  IconButton,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Badge,
  CalendarMonth,
  Update,
  Lock,
} from "@mui/icons-material";
import { motion } from "framer-motion";
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
  createdAt: string;
  updatedAt: string;
};

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Profile() {
  const { id, userId } = useParams<RouteParams>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const effectiveUserId = userId ?? id;

  const buildProfileFromResponse = (raw: any): UserProfile => {
    const data = raw?.data ?? raw?.user ?? raw;

    const resolvedRole =
      data?.role?.name ??
      data?.role?.code ??
      data?.role ??
      (Array.isArray(data?.roles) ? data.roles[0]?.name : "") ??
      "";

    return {
      id: Number(
        data?.id ??
          data?.userId ??
          data?.user_id ??
          data?.userID ??
          data?.user_id_pk ??
          0
      ),
      username:
        data?.username ??
        data?.userName ??
        data?.user_name ??
        data?.login ??
        "",
      firstName: data?.firstName ?? data?.first_name ?? "",
      lastName: data?.lastName ?? data?.last_name ?? "",
      email: data?.email ?? "",
      role: resolvedRole,
      createdAt: data?.createdAt ?? data?.created_at ?? "",
      updatedAt: data?.updatedAt ?? data?.updated_at ?? "",
    };
  };

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      const response = effectiveUserId
        ? await apiClient.get(`/users/${effectiveUserId}`)
        : await apiClient.get("/users/me");

      const userProfile = buildProfileFromResponse(response.data);
      setProfile(userProfile);
      setForm({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
        password: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        navigate("/login", { replace: true });
        return;
      }
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <Typography variant="h6" textAlign="center">
          Unable to load profile
        </Typography>
      </Layout>
    );
  }

  const initials =
    (profile.firstName?.[0] || "") + (profile.lastName?.[0] || "");

  return (
    <Layout>
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box textAlign="center">
              <Avatar sx={{ width: 96, height: 96, mb: 2 }}>
                {initials || profile.username?.[0] || "U"}
              </Avatar>
              <Typography variant="h6">
                {profile.firstName} {profile.lastName}
              </Typography>
              <Chip label={profile.role || "N/A"} size="small" sx={{ mt: 1 }} />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="First name"
                  value={form.firstName}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Last name"
                  value={form.lastName}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Email" value={form.email} />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box display="flex" justifyContent="flex-end" gap={2}>
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
