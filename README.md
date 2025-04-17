# Solar Panel Anomaly Detection System

![Solar Panel Anomaly Detection](https://via.placeholder.com/800x400?text=Solar+Panel+Anomaly+Detection)

## Overview

This project implements an advanced anomaly detection system for solar panels using YOLO v8 and ROS (Robot Operating System). The system is designed to identify and classify defects in solar panels through real-time video analysis, helping to improve quality control in solar panel manufacturing and maintenance.

The system features a web-based monitoring interface built with React.js, real-time detection capabilities powered by NVIDIA Jetson hardware, and a continuous improvement mechanism that allows users to provide feedback on detections to improve model accuracy over time.

## Key Features

- **Real-time Defect Detection**: Uses YOLO v8 to identify 12 types of solar panel defects including cracks, black cores, finger defects, and more
- **ROS Integration**: Implements efficient image processing pipelines using NVIDIA Isaac ROS
- **Web-based Monitoring**: React.js interface for viewing live detection feeds and managing the system
- **Continuous Learning**: User feedback mechanism for model improvement
- **Annotation Tools**: Built-in tools for correcting and adding annotations to improve the dataset
- **GPU Acceleration**: Optimized for NVIDIA Jetson hardware for efficient processing
- **Containerized Deployment**: Docker integration for easy setup and deployment

## System Architecture

The system consists of the following components:

1. **Camera Feed Pipeline**: Captures video input using GStreamer, optimized for GPU processing
2. **NVIDIA Isaac ROS Pipeline**:
   - DNN Encoders Node: Converts images to tensors
   - TensorRT Inference Node: Runs the YOLO model
   - DNN Decoder Node: Processes detection results
3. **Web Interface**: React.js application for monitoring and control
4. **Backend Server**: Flask-based API for system control and data management
5. **ROS Bridge**: Enables communication between ROS and web interface

## Defect Types Detected

The system can identify the following types of solar panel defects:
- Black core
- Crack
- Finger
- Star crack
- Thick line
- Corner
- Fragment
- Scratch
- Printing error
- Horizontal dislocation
- Vertical dislocation
- Short circuit

## Prerequisites

- NVIDIA Jetson device (Nano, Xavier NX, or AGX)
- Ubuntu 20.04 or later
- ROS2 Humble
- Docker
- CUDA 11.4 or later
- Python 3.8 or later
- Node.js 14.x or later

## Installation

### 1. Clone the Repository


### 2. Set Up the Jetson Device

Ensure your Jetson device is set up with JetPack (includes CUDA, cuDNN, and TensorRT).

### 3. Install ROS2 Humble

Follow the [ROS2 installation instructions](https://docs.ros.org/en/humble/Installation.html).

### 4. Build the Docker Container

```bash
docker build -t solar-anomaly-detection .
```

### 5. Set Up the Web Interface

```bash
cd web-interface
npm install
npm run build
```

## Usage

### 1. Start the ROS Container

```bash
./scripts/run_container.sh
```

### 2. Launch the Camera Pipeline

```bash
./scripts/run_camera.sh
```

### 3. Start the Web Server

```bash
cd server
python app.py
```

### 4. Access the Web Interface

Open a browser and navigate to `http://localhost:3000`

## Web Interface Features

- **Live Detection Feed**: View real-time solar panel inspection with highlighted defects
- **Pipeline Control**: Start/stop the detection pipeline and select models
- **Reporting**: Report inaccurate predictions for later correction
- **Annotation**: Correct or add annotations to improve the model
- **Segmentation**: Segment defects for more precise detection
- **Model Management**: Upload new trained models

## Performance Analysis

- Network latency analysis available in the documentation
- One-way and round-trip latency measurements for different data types
- API response time analysis

## Future Work

- Automated retraining pipeline
- Integration with cloud services (AWS SageMaker or Azure ML-Ops)
- Extension to other industrial inspection domains
- Enhanced automated image segmentation



## Acknowledgments

- Professor Kaikai Liu for guidance and support
- San Jose State University for providing resources
- NVIDIA AI IOT team for their sample prototype
- Roboflow and Ultralytics teams for annotation and training platforms
