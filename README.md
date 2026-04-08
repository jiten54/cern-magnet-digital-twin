
<img width="1920" height="866" alt="Screenshot 2026-04-08 185943" src="https://github.com/user-attachments/assets/b629b8be-b1fb-4586-acf1-d68ab11481e3" />
<img width="1914" height="854" alt="Screenshot 2026-04-08 190053" src="https://github.com/user-attachments/assets/f98f2994-5943-4942-a5a8-14961ee08d26" />


# CERN Digital Twin: Superconducting Magnet Circuits

A production-grade platform for simulating, monitoring, and predicting the behavior of superconducting magnet circuits.

## Architecture

- **Simulation Engine**: Solves differential equations for $V, I, T$ relationships in superconducting magnets.
- **Sync Engine**: Reconciles physical telemetry with digital twin state using drift correction.
- **Backend (Express)**: Provides high-frequency API endpoints and manages system state.
- **Frontend (React + Recharts)**: Industrial-grade dashboard for real-time visualization and fault injection.

## Key Features

- **Real-time Synchronization**: The digital twin tracks the physical system with sub-millisecond precision.
- **Quench Simulation**: Models the transition from superconducting to resistive state.
- **Fault Injection**: Safely simulate system failures to test protection logic.
- **Drift Correction**: Adjusts for sensor inaccuracies in real-time.

## Physics Model

The system solves:
1. $V(t) = L \frac{di}{dt} + R(i, T) \cdot i(t)$
2. $C \frac{dT}{dt} = R \cdot i^2 - Q_{cool}$

Where $R$ is non-linear and depends on the critical temperature $T_{crit}$.


# ⚙️ CERN Magnet Digital Twin: Real-Time Simulation & Synchronization System

> A production-grade Digital Twin platform for superconducting magnet circuits, featuring physics-informed simulation, real-time synchronization, fault injection, and predictive system analysis.

---

## 🚀 Overview

The **CERN Magnet Digital Twin** is an advanced system designed to replicate and monitor the behavior of superconducting magnet circuits in real time.

This platform simulates physical system dynamics while continuously synchronizing with live data streams, enabling:

* Real-time system monitoring
* Predictive simulation
* Fault injection and analysis
* System divergence tracking

Built with a strong focus on **systems engineering, reliability, and scalability**, this project reflects real-world digital twin architectures used in high-energy physics environments.

---

## 🎯 Problem Statement

Superconducting magnet circuits operate under extreme conditions:

* High current (kA range)
* Ultra-low temperatures (~1.9 K)
* Tight coupling between electrical and thermal dynamics

Failures such as **quenching** (transition from superconducting to resistive state) can result in:

* Rapid temperature rise
* Current instability
* System shutdown

Traditional monitoring systems:

* React after failure
* Lack predictive capabilities
* Cannot simulate future scenarios

👉 This project introduces a **Digital Twin system** that enables proactive monitoring and simulation.

---

## 🧠 Key Capabilities

### 🔄 Real-Time Synchronization

* Continuous alignment between physical system and digital twin
* Drift correction and state reconciliation

### ⚙️ Physics-Based Simulation

* Models relationships between:

  * Voltage
  * Current
  * Temperature
* Simulates normal and failure states

### 🚨 Fault Injection Engine

* Simulate quench events safely
* Analyze system response without real-world risk

### 📊 Divergence Analysis

* Measures difference between real system and digital twin
* Detects synchronization errors

### 🧪 Predictive Simulation

* Simulate future system behavior
* “What-if” scenario analysis

---

## 🏗️ System Architecture

```id="arc01"
Real Data Stream → Sync Engine → Simulation Engine → State Manager → FastAPI Backend → Dashboard
```

---

## 📂 Project Structure

```id="arc02"
cern-magnet-digital-twin/
│
├── data/                         # Input and simulated datasets
├── src/
│   ├── simulation/               # Core simulation logic
│   │   ├── simulation_core.py
│   │   ├── physics_model.py
│   │   ├── state_manager.py
│   │
│   ├── sync/                     # Synchronization engine
│   │   ├── sync_engine.py
│   │   ├── drift_correction.py
│   │
│   ├── api/                      # FastAPI backend
│   │   ├── main.py
│   │   ├── routes/
│   │
│   ├── utils/                    # Helper utilities
│
├── dashboard/                    # Frontend (React/Streamlit)
├── tests/                        # Unit & integration tests
├── docker/                       # Docker configs
├── README.md
```

---

## ⚙️ Core Components

### 1. Simulation Engine

* Time-step based system simulation
* Physics-informed modeling
* Handles dynamic system transitions

### 2. Sync Engine

* Aligns digital twin with real-world data
* Handles:

  * Latency
  * Missing data
  * Sensor drift

### 3. State Manager

* Maintains system state
* Tracks:

  * Current conditions
  * Historical states
  * System transitions

### 4. Backend API

* Built with FastAPI
* Provides endpoints for:

  * State retrieval
  * Simulation control
  * Fault injection

### 5. Dashboard

* Industrial-style UI
* Real vs Twin comparison
* Control panel for system interaction

---

## 📊 Key Metrics

| Metric             | Description                                  |
| ------------------ | -------------------------------------------- |
| Sync Error         | Difference between real and simulated values |
| Divergence Score   | System mismatch over time                    |
| System State       | Normal / Warning / Critical                  |
| Simulation Latency | Response time of digital twin                |

---

## 🔬 Simulation Model

The system models interactions between:

* Electrical behavior (current, voltage)
* Thermal behavior (temperature rise)

Supports:

* Normal operation
* Transition states
* Failure scenarios (quench simulation)

---

## 🔐 Security & Reliability

* JWT-based authentication
* Role-based access:

  * Admin → control & fault injection
  * Viewer → read-only
* Input validation and sanitization
* Logging and monitoring

---

## 🧪 Testing

* Unit tests for simulation accuracy
* API testing
* Integration testing for system workflows

```bash id="test01"
pytest tests/
```

---

## ⚡ Installation

```bash id="inst01"
git clone https://github.com/your-username/cern-magnet-digital-twin.git
cd cern-magnet-digital-twin

pip install -r requirements.txt
```

---

## ▶️ Running the System

### Start Backend

```bash id="run01"
uvicorn src.api.main:app --reload
```

### Launch Dashboard

```bash id="run02"
streamlit run dashboard/app.py
```

---

## 🚀 Deployment

* Dockerized microservice architecture
* Deployable on:

  * AWS
  * Render
  * Railway

---

## 🔮 Future Enhancements

* Kafka-based real-time streaming
* Multi-circuit simulation support
* Advanced physics modeling
* Edge deployment for low-latency environments

---

## 🌍 Inspiration

Inspired by real-world digital twin and magnet protection systems used in advanced particle accelerators and high-energy physics research environments.

---

## 👨‍💻 Author

**Jiten Moni Das**
Machine Learning Engineer | AI Developer

🔗 LinkedIn: https://www.linkedin.com/in/jiten-moni-3045b7265/
🔗 GitHub: https://github.com/jiten54

---

## ⭐ Star this repository if you find it valuable!


## Security

- **Role-Based Access**: (Simulated) Admin controls for fault injection.
- **Input Validation**: Strict schema enforcement for API requests.
