/**
 * Physics-inspired Simulation Engine for Superconducting Magnet Circuits.
 * Simulates Voltage, Current, and Temperature relationships.
 */

export interface MagnetState {
  timestamp: number;
  voltage: number; // [V]
  current: number; // [A]
  temperature: number; // [K]
  resistance: number; // [Ohm]
  isQuenched: boolean;
}

export class SimulationEngine {
  // Physical Constants
  private readonly L = 0.5; // Inductance [H]
  private readonly C = 1000; // Heat Capacity [J/K]
  private readonly R_nominal = 1e-9; // Nominal superconducting resistance [Ohm]
  private readonly R_quench = 0.1; // Resistance when quenched [Ohm]
  private readonly T_crit = 9.5; // Critical temperature [K]
  private readonly T_ambient = 1.9; // Cryogenic ambient temperature [K]
  private readonly CoolingPower = 50; // Constant cooling [W]

  private state: MagnetState;

  constructor(initialCurrent = 0) {
    this.state = {
      timestamp: Date.now(),
      voltage: 0,
      current: initialCurrent,
      temperature: 1.9,
      resistance: 1e-9,
      isQuenched: false,
    };
  }

  /**
   * Performs a single time-step simulation using Euler integration.
   * @param dt Time step in seconds
   * @param targetVoltage Applied voltage from power supply
   */
  step(dt: number, targetVoltage: number, faultInjected = false): MagnetState {
    const { current, temperature } = this.state;

    // 1. Determine Resistance
    let resistance = this.R_nominal;
    if (temperature > this.T_crit || faultInjected) {
      this.state.isQuenched = true;
    }

    if (this.state.isQuenched) {
      // Resistance grows as temperature increases during a quench
      resistance = this.R_quench * (1 + 0.1 * (temperature - this.T_crit));
    }

    // 2. Calculate dI/dt (V = L*di/dt + R*I)
    const di_dt = (targetVoltage - resistance * current) / this.L;
    const newCurrent = Math.max(0, current + di_dt * dt);

    // 3. Calculate dT/dt (C*dT/dt = R*I^2 - Cooling)
    const heating = resistance * Math.pow(current, 2);
    const cooling = this.CoolingPower * (temperature - this.T_ambient);
    const dT_dt = (heating - cooling) / this.C;
    const newTemperature = Math.max(this.T_ambient, temperature + dT_dt * dt);

    this.state = {
      timestamp: Date.now(),
      voltage: targetVoltage,
      current: newCurrent,
      temperature: newTemperature,
      resistance: resistance,
      isQuenched: this.state.isQuenched,
    };

    return this.state;
  }

  getState(): MagnetState {
    return { ...this.state };
  }

  reset(current = 0) {
    this.state = {
      timestamp: Date.now(),
      voltage: 0,
      current: current,
      temperature: 1.9,
      resistance: 1e-9,
      isQuenched: false,
    };
  }
}
