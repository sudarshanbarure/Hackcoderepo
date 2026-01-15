import Layout from "../components/Layout";
import { Paper, Typography, Box, Avatar, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid";
import { DownloadOutlined, VisibilityOutlined } from "@mui/icons-material";

const reports = [
  { id: 1, name: "Q4 Compliance", date: "2024-01-10" },
  { id: 2, name: "Metrics", date: "2024-01-12" },
];

export default function ViewerReports() {
  return (
    <Layout>
      <Typography variant="h4" mb={3}>
        Reports
      </Typography>

      <Grid container spacing={3}>
        {reports.map((r) => (
          <Grid key={r.id} size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, display: "flex", justifyContent: "space-between" }}>
              <Box display="flex" gap={2}>
                <Avatar>
                  <DownloadOutlined />
                </Avatar>
                <Box>
                  <Typography fontWeight={600}>{r.name}</Typography>
                  <Typography variant="caption">{r.date}</Typography>
                </Box>
              </Box>
              <IconButton>
                <VisibilityOutlined />
              </IconButton>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
}
