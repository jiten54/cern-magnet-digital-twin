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

## Security

- **Role-Based Access**: (Simulated) Admin controls for fault injection.
- **Input Validation**: Strict schema enforcement for API requests.
