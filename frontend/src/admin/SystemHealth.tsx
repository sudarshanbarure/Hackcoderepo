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
import Grid from "@mui/material/Grid2";
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

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await usersApi.getRoleStats();
        const c = res.data?.data || {};
        setRoleCounts({
          ADMIN: Number(c.ADMIN ?? 0),
          MANAGER: Number(c.MANAGER ?? 0),
          REVIEWER: Number(c.REVIEWER ?? 0),
          VIEWER: Number(c.VIEWER ?? 0),
        });
      } catch {
        setError("Failed to load system metrics");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const total =
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
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Users by Role</Typography>

            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {error && <Typography color="error">{error}</Typography>}
                {roleCounts && (
                  <Box mt={2} display="flex" gap={1} flexWrap="wrap">
                    <Chip label={`Admin ${roleCounts.ADMIN}`} color="error" />
                    <Chip label={`Manager ${roleCounts.MANAGER}`} color="warning" />
                    <Chip label={`Reviewer ${roleCounts.REVIEWER}`} color="info" />
                    <Chip label={`Viewer ${roleCounts.VIEWER}`} color="success" />
                  </Box>
                )}
              </>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">System Load</Typography>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={[{ t: "now", v: total || 10 }]}>
                <XAxis dataKey="t" />
                <YAxis />
                <Tooltip />
                <Line dataKey="v" />
              </LineChart>
            </ResponsiveContainer>

            <Divider sx={{ mt: 2 }} />
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}
