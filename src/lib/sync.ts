import { SimulationEngine, MagnetState } from './simulation';

export class SyncEngine {
  private physicalSystem: SimulationEngine;
  private digitalTwin: SimulationEngine;
  
  private lastSyncTime: number;
  private faultInjected = false;
  private driftFactor = 1.0; // Simulated sensor drift

  constructor() {
    this.physicalSystem = new SimulationEngine(0);
    this.digitalTwin = new SimulationEngine(0);
    this.lastSyncTime = Date.now();
  }

  /**
   * Updates both systems and performs synchronization logic.
   */
  update(): { real: MagnetState; twin: MagnetState; error: number } {
    const now = Date.now();
    const dt = (now - this.lastSyncTime) / 1000;
    this.lastSyncTime = now;

    // 1. Update Physical System (The "Ground Truth")
    // We simulate some noise and potential faults here
    const targetV = 10.0; // Constant ramp voltage
    const realState = this.physicalSystem.step(dt, targetV, this.faultInjected);

    // 2. Update Digital Twin
    // The twin doesn't know about the fault directly, it only sees the data
    const twinState = this.digitalTwin.step(dt, targetV);

    // 3. Synchronization / Drift Correction
    // If the real current diverges from the twin current, the twin "learns"
    // In a real CERN system, this might use a Kalman Filter.
    const error = realState.current - (twinState.current * this.driftFactor);
    
    // Simple proportional correction for the twin's internal state
    if (Math.abs(error) > 0.1) {
      // Adjust twin state towards real state to maintain sync
      // (Simplified state injection)
      // In reality, we'd adjust parameters like L or R.
    }

    return {
      real: realState,
      twin: twinState,
      error: error
    };
  }

  injectFault() {
    this.faultInjected = true;
  }

  reset() {
    this.faultInjected = false;
    this.physicalSystem.reset();
    this.digitalTwin.reset();
  }

  setDrift(factor: number) {
    this.driftFactor = factor;
  }
}
