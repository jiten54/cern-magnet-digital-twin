import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Zap, 
  Thermometer, 
  AlertTriangle, 
  RefreshCw, 
  Play, 
  ShieldAlert,
  Settings,
  History as HistoryIcon
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MagnetState {
  timestamp: number;
  voltage: number;
  current: number;
  temperature: number;
  resistance: number;
  isQuenched: boolean;
}

interface SyncData {
  real: MagnetState;
  twin: MagnetState;
  error: number;
}

export default function App() {
  const [data, setData] = useState<SyncData | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [drift, setDrift] = useState(1.0);

  const fetchData = async () => {
    try {
      const [stateRes, historyRes] = await Promise.all([
        fetch('/api/state'),
        fetch('/api/history')
      ]);
      const stateData = await stateRes.json();
      const historyData = await historyRes.json();
      
      setData(stateData);
      setHistory(historyData.map((h: any) => ({
        time: new Date(h.timestamp).toLocaleTimeString(),
        realI: h.real.current,
        twinI: h.twin.current,
        realT: h.real.temperature,
        twinT: h.twin.temperature,
        error: h.error
      })));
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchData, 500);
    return () => clearInterval(interval);
  }, []);

  const injectFault = async () => {
    await fetch('/api/inject-fault', { method: 'POST' });
  };

  const resetSystem = async () => {
    await fetch('/api/reset', { method: 'POST' });
  };

  const updateDrift = async (val: number) => {
    setDrift(val);
    await fetch('/api/drift', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ factor: val })
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-500 font-mono">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="animate-spin w-12 h-12" />
          <p className="text-xl tracking-widest">INITIALIZING DIGITAL TWIN...</p>
        </div>
      </div>
    );
  }

  const isQuenched = data?.real.isQuenched;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-mono p-6 selection:bg-emerald-500/30">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded">
            <Activity className="text-slate-950 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tighter text-emerald-500">CERN MAGNET DIGITAL TWIN</h1>
            <p className="text-xs text-slate-500">SYSTEM ID: LHC-MQ-01 | STATUS: {isQuenched ? 'QUENCH DETECTED' : 'OPERATIONAL'}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded border border-slate-800">
            <div className={cn("w-2 h-2 rounded-full animate-pulse", isQuenched ? "bg-red-500" : "bg-emerald-500")} />
            <span className="text-xs uppercase tracking-widest">{isQuenched ? 'Critical' : 'Nominal'}</span>
          </div>
          <button 
            onClick={resetSystem}
            className="p-2 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-white"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Real-time Telemetry Cards */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <TelemetryCard 
            title="Current (I)" 
            value={data?.real.current.toFixed(2) || '0.00'} 
            unit="A" 
            icon={<Zap className="w-4 h-4" />}
            trend={data?.real.current! > data?.twin.current! ? 'up' : 'down'}
          />
          <TelemetryCard 
            title="Voltage (V)" 
            value={data?.real.voltage.toFixed(2) || '0.00'} 
            unit="V" 
            icon={<Play className="w-4 h-4" />}
          />
          <TelemetryCard 
            title="Temperature (T)" 
            value={data?.real.temperature.toFixed(2) || '0.00'} 
            unit="K" 
            icon={<Thermometer className="w-4 h-4" />}
            alert={data?.real.temperature! > 9.0}
          />
          <TelemetryCard 
            title="Sync Error" 
            value={data?.error.toFixed(4) || '0.0000'} 
            unit="ΔI" 
            icon={<HistoryIcon className="w-4 h-4" />}
            alert={Math.abs(data?.error || 0) > 0.5}
          />
        </div>

        {/* Main Visualization */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 h-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Current Synchronization (Real vs Twin)</h3>
              <div className="flex gap-4 text-[10px]">
                <span className="flex items-center gap-1 text-emerald-400"><div className="w-2 h-2 bg-emerald-400 rounded-full" /> PHYSICAL</span>
                <span className="flex items-center gap-1 text-blue-400"><div className="w-2 h-2 bg-blue-400 rounded-full" /> DIGITAL TWIN</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis stroke="#475569" fontSize={10} domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', fontSize: '12px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Line type="monotone" dataKey="realI" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="twinI" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 h-[300px]">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Thermal Profile</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis stroke="#475569" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="realT" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="twinT" stroke="#f97316" strokeWidth={2} strokeDasharray="5 5" dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Control Panel */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6 text-emerald-500">
              <Settings className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-widest">Control Panel</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-2">Sensor Drift Correction</label>
                <input 
                  type="range" 
                  min="0.8" 
                  max="1.2" 
                  step="0.01" 
                  value={drift}
                  onChange={(e) => updateDrift(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] mt-1 text-slate-400">
                  <span>0.8x</span>
                  <span>{drift.toFixed(2)}x</span>
                  <span>1.2x</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button 
                  onClick={injectFault}
                  disabled={isQuenched}
                  className={cn(
                    "w-full py-3 rounded flex items-center justify-center gap-2 font-bold transition-all",
                    isQuenched 
                      ? "bg-slate-800 text-slate-600 cursor-not-allowed" 
                      : "bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white"
                  )}
                >
                  <ShieldAlert className="w-5 h-5" />
                  INJECT QUENCH FAULT
                </button>
                <p className="text-[9px] text-slate-500 mt-2 text-center italic">
                  WARNING: Fault injection simulates a sudden transition to resistive state.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/30 border border-slate-800/50 rounded-lg p-6">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">System Diagnostics</h3>
            <div className="space-y-2 text-[10px]">
              <div className="flex justify-between">
                <span>L-Inductance</span>
                <span className="text-emerald-500">0.50 H</span>
              </div>
              <div className="flex justify-between">
                <span>C-Heat Capacity</span>
                <span className="text-emerald-500">1000 J/K</span>
              </div>
              <div className="flex justify-between">
                <span>T-Critical</span>
                <span className="text-red-500">9.50 K</span>
              </div>
              <div className="flex justify-between">
                <span>R-Nominal</span>
                <span className="text-emerald-500">1.0e-9 Ω</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Status Bar */}
      <footer className="mt-8 flex justify-between items-center text-[10px] text-slate-600 border-t border-slate-800 pt-4">
        <div>LATENCY: 42ms | REFRESH: 2Hz | ENGINE: TS-PHYSICS-V1</div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> DB SYNC</span>
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> API READY</span>
        </div>
      </footer>
    </div>
  );
}

function TelemetryCard({ title, value, unit, icon, trend, alert }: { 
  title: string; 
  value: string; 
  unit: string; 
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  alert?: boolean;
}) {
  return (
    <div className={cn(
      "bg-slate-900 border p-4 rounded-lg transition-all",
      alert ? "border-red-500/50 bg-red-500/5" : "border-slate-800"
    )}>
      <div className="flex items-center gap-2 text-slate-500 mb-1">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">{title}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className={cn("text-2xl font-bold tabular-nums", alert ? "text-red-500" : "text-slate-100")}>{value}</span>
        <span className="text-xs text-slate-500">{unit}</span>
      </div>
    </div>
  );
}
