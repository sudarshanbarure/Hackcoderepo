import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  Paper,
  Typography,
  Divider,
  Box,
  CircularProgress,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { usersApi } from "../api/users.api";

type RoleCounts = {
  ADMIN: number;
  MANAGER: number;
  REVIEWER: number;
  VIEWER: number;
};

export default function SystemHealth() {
  const [roleCounts, setRoleCounts] = useState<RoleCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await usersApi.getRoleStats();
      const counts = res.data?.data || {};
      setRoleCounts({
        ADMIN: Number(counts.ADMIN ?? 0),
        MANAGER: Number(counts.MANAGER ?? 0),
        REVIEWER: Number(counts.REVIEWER ?? 0),
        VIEWER: Number(counts.VIEWER ?? 0),
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to load system health metrics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalUsers =
    (roleCounts?.ADMIN ?? 0) +
    (roleCounts?.MANAGER ?? 0) +
    (roleCounts?.REVIEWER ?? 0) +
    (roleCounts?.VIEWER ?? 0);

  return (
    <Layout>
      <Typography variant="h4" mb={3}>
        System Health
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" mb={2}>
              Active Users by Role
            </Typography>

            {loading ? (
              <Box display="flex" justifyContent="center" py={6}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {error && (
                  <Typography color="error" mb={2}>
                    {error}
                  </Typography>
                )}

                {roleCounts && (
                  <>
                    <Typography variant="body2" mb={1}>
                      Total users: <b>{totalUsers}</b>
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      <Chip label={`Admin: ${roleCounts.ADMIN}`} color="error" />
                      <Chip label={`Manager: ${roleCounts.MANAGER}`} color="warning" />
                      <Chip label={`Reviewer: ${roleCounts.REVIEWER}`} color="info" />
                      <Chip label={`Viewer: ${roleCounts.VIEWER}`} color="success" />
                    </Box>
                  </>
                )}
              </>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              System Load (%)
            </Typography>

            <ResponsiveContainer width="100%" height={260}>
              <LineChart
                data={[
                  { time: "Now", load: Math.min(100, totalUsers * 2 || 10) },
                ]}
              >
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="load" stroke="#22C55E" />
              </LineChart>
            </ResponsiveContainer>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="text.secondary">
              Metrics refresh automatically every 30 seconds.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}
