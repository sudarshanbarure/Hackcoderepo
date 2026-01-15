import Layout from "../components/Layout";
import {
  Paper,
  Typography,
  Box,
  Grid,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  DownloadOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";

const reports = [
  { id: 1, name: "Q4 Financial Compliance", date: "2024-01-10", type: "PDF" },
  { id: 2, name: "Service Ingestion Metrics", date: "2024-01-12", type: "Excel" },
  { id: 3, name: "Anomaly Detection Logs", date: "2024-01-13", type: "JSON" },
];

export default function ViewerReports() {
  return (
    <Layout>
      <Typography variant="h4" mb={3}>
        Reports Summary
      </Typography>

      <Grid container spacing={3}>
        {reports.map((report) => (
          <Grid item xs={12} md={4} key={report.id}>
            <Paper
              sx={{
                p: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: 3,
              }}
            >
              <Box display="flex" gap={2} alignItems="center">
                <Avatar>
                  <DownloadOutlined />
                </Avatar>
                <Box>
                  <Typography fontWeight={600}>{report.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {report.type} • {report.date}
                  </Typography>
                </Box>
              </Box>

              <IconButton color="primary">
                <VisibilityOutlined />
              </IconButton>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
}
