import React, { useState } from "react";
import axios from "axios";
import {
  LinearProgress,
  CircularProgress,
  Box,
  Typography,
  Button,
  Container,
  Grid,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function AutoTrain() {
  const [trainingStatus, setTrainingStatus] = useState("Idle");
  const [deploymentStatus, setDeploymentStatus] = useState("Idle");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(
    'Click "Start" to start the pipeline.'
  );

  const startTraining = () => {
    try {
      setTrainingStatus("Training...");
      setMessage(
        "Pipeline called to start. Hang tight, we will inform you once the it is started."
      );
      setProgress(10);
      // Mock API call to start training
      axios
        .get("http://10.0.0.243:5000/run-script")
        .then((result) => console.log(result))
        .catch((error) => {
          console.log(error);
        });
      setProgress(20);
      setTimeout(() => {
        setTrainingStatus("Success");
        setMessage("Started the piepline");
        setProgress(60);
        axios
          .get("http://10.0.0.243:5000/run-docker")
          .then((result) => {
            console.log(result);
            setProgress(80);
            setMessage("Settingup the docker");
            axios
              .get("http://10.0.0.243:5000/run-camera")
              .then((result) => console.log(result))
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      }, 2 * 60 * 1000);
      setProgress(100);
    } catch (err) {
      console.error("Error starting training", err);
      setTrainingStatus("Failed");
      setProgress(0);
      setMessage("Failed to start. Please check the console for more details.");
    }
  };

  const startDeployment = async () => {
    try {
      setDeploymentStatus("Deploying...");
      setMessage("Deployment has started. Please wait...");
      // Mock API call to start deployment
      await axios.post("http://localhost:5000/deploy");
      setDeploymentStatus("Success");
      setMessage("Deployment is complete. Your model is now live!");
    } catch (err) {
      console.error("Error starting deployment", err);
      setDeploymentStatus("Failed");
      setMessage(
        "Failed to start deployment. Please check the console for more details."
      );
    }
  };

  return (
    <Grid container alignItems="center" justifyContent="center">
      <Container component="main" maxWidth="sm" sx={{ textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Start the pipeline
        </Typography>
        <Button
          variant="contained"
          onClick={startTraining}
          disabled={trainingStatus === "Training..."}
          sx={{ mb: 2 }}
        >
          Start
        </Button>
        {/* {trainingStatus === "Success" && (
          <Button
            variant="contained"
            color="secondary"
            onClick={startDeployment}
            disabled={deploymentStatus === "Deploying..."}
            sx={{ mb: 2, ml: 2 }}
          >
            Deploy Model
          </Button>
        )} */}
        <Box sx={{ width: "100%", mt: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 2,
          }}
        >
          {trainingStatus === "Success" && (
            <CheckCircleIcon color="success" sx={{ mr: 2 }} />
          )}
          {progress < 100 && progress > 0 && (
            <CircularProgress size={24} sx={{ mr: 2 }} />
          )}
          <Typography variant="body1">{message}</Typography>
        </Box>
      </Container>
    </Grid>
  );
}

export default AutoTrain;
