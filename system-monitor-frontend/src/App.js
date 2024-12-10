import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  TablePagination,
  TextField,
  Button,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import { ArrowDownward, ArrowUpward, Delete } from "@mui/icons-material";

const App = () => {
  const [processes, setProcesses] = useState([]);
  const [filteredProcesses, setFilteredProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [systemSummary, setSystemSummary] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  // Fetch Processes and System Summary
  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const processResponse = await axios.get("http://127.0.0.1:8000/api/processes/");
        setProcesses(processResponse.data.processes);
        setFilteredProcesses(processResponse.data.processes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching processes:", error);
        setLoading(false);
      }
    };
    fetchProcesses();
  }, []);

  // Fetch System Summary Regularly
  useEffect(() => {
    const fetchSystemSummary = async () => {
      try {
        const summaryResponse = await axios.get("http://127.0.0.1:8000/api/system-summary/");
        setSystemSummary(summaryResponse.data);
      } catch (error) {
        console.error("Error fetching system summary:", error);
      }
    };

    // Fetch initially and set interval
    fetchSystemSummary();
    const intervalId = setInterval(fetchSystemSummary, 5000); // Fetch every 5 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Handle Search
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    const filtered = processes.filter((proc) =>
      proc.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
      proc.pid.toString().includes(event.target.value)
    );
    setFilteredProcesses(filtered);
  };

  // Handle Sorting
  const handleSort = (key) => {
    const direction = sortConfig.direction === "asc" ? "desc" : "asc";
    const sortedProcesses = [...filteredProcesses].sort((a, b) => {
      if (key === "cpu_percent" || key === "memory_percent") {
        return direction === "asc"
          ? a[key] - b[key]
          : b[key] - a[key];
      } else if (key === "start_time" || key === "pid") {
        return direction === "asc"
          ? a[key] - b[key]
          : b[key] - a[key];
      } else {
        return 0;
      }
    });
    setFilteredProcesses(sortedProcesses);
    setSortConfig({ key, direction });
  };

  // Handle Refresh
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/processes/");
      setProcesses(response.data.processes);
      setFilteredProcesses(response.data.processes);
    } catch (error) {
      console.error("Error refreshing process data:", error);
    }
    setLoading(false);
  };

  // Terminate Process
  const handleTerminate = async (pid) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/processes/terminate/${pid}/`);
      handleRefresh(); // Refresh the list after termination
      alert(`Process ${pid} terminated successfully.`);
    } catch (error) {
      alert(`Error terminating process ${pid}: ${error.response.data.error}`);
    }
  };

  // Handle Pagination
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: "80%", margin: "auto", padding: "20px" }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        System Process Monitor
      </Typography>

      {systemSummary && (
        <Card sx={{ marginBottom: "20px" }}>
          <CardContent>
            <Typography variant="h5">System Summary</Typography>
            <Typography>Total CPU Usage: {systemSummary.total_cpu_usage}%</Typography>
            <Typography>Total Memory Usage: {systemSummary.total_memory_usage.toFixed(2)}%</Typography>
          </CardContent>
        </Card>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <TextField
          label="Search by Name or PID"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          sx={{ width: "50%" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleRefresh}
          sx={{ height: "56px" }}
        >
          Refresh
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ boxShadow: 3, maxHeight: "500px" }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
              <TableRow>
                  <TableCell onClick={() => handleSort("pid")}>
                    <strong>PID</strong>
                    {sortConfig.key === "pid" && (
                      <IconButton>
                        {sortConfig.direction === "asc" ? <ArrowUpward /> : <ArrowDownward />}
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell onClick={() => handleSort("name")}>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell onClick={() => handleSort("cpu_percent")}>
                    <strong>CPU %</strong>
                    {sortConfig.key === "cpu_percent" && (
                      <IconButton>
                        {sortConfig.direction === "asc" ? <ArrowUpward /> : <ArrowDownward />}
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell onClick={() => handleSort("memory_percent")}>
                    <strong>Memory %</strong>
                    {sortConfig.key === "memory_percent" && (
                      <IconButton>
                        {sortConfig.direction === "asc" ? <ArrowUpward /> : <ArrowDownward />}
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell onClick={() => handleSort("start_time")}>
                    <strong>Start Time</strong>
                    {sortConfig.key === "start_time" && (
                      <IconButton>
                        {sortConfig.direction === "asc" ? <ArrowUpward /> : <ArrowDownward />}
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell onClick={() => handleSort("user")}>
                    <strong>User</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProcesses
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((proc) => (
                    <TableRow key={proc.pid}>
                      <TableCell>{proc.pid}</TableCell>
                      <TableCell>{proc.name}</TableCell>
                      <TableCell>{proc.cpu_percent}</TableCell>
                      <TableCell>{proc.memory_percent ? proc.memory_percent.toFixed(2) : "N/A"}</TableCell>
                      <TableCell>{new Date(proc.start_time * 1000).toLocaleString()}</TableCell>
                      <TableCell>{proc.user}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleTerminate(proc.pid)}
                          startIcon={<Delete />}
                        >
                          Terminate
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredProcesses.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Box>
  );
};

export default App;
