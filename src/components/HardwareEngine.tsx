import React from "react";
import { HardwareConfig } from "../types";
import { sfx } from "../utils/sfx";
import { Cpu, Zap, Sparkles, Shield, Activity, Flame, Gauge, Check } from "lucide-react";

interface HardwareEngineProps {
  hardware: HardwareConfig;
  updateHardware: (newConfig: Partial<HardwareConfig>) => void;
}

export const HardwareEngine: React.FC<HardwareEngineProps> = ({
  hardware,
  updateHardware,
}) => {
  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-indigo-500/20 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Cpu className="w-4 h-4" />
            <span>SIMULATED HARDWARE SHADER PIPELINE</span>
          </div>

          <h2 className="text-3xl font-black uppercase tracking-tight text-white">
            GPU/CPU RTX & AI Frame Generation Engine
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed">
            Configure real-time Ray Tracing, Path Tracing, and AI Frame Interpolation (DLSS/FSR) for maximum fluid performance across high-refresh gaming displays, handhelds, and 4K Smart TVs.
          </p>
        </div>
      </div>

      {/* Control Toggles & Hardware Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* RTX Ray Tracing Toggle Card */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Zap className="w-5 h-5" />
              <span>RTX Ray Tracing</span>
            </div>
            <button
              onClick={() => {
                sfx.playClick();
                updateHardware({ rtxEnabled: !hardware.rtxEnabled });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                hardware.rtxEnabled ? "bg-cyan-500" : "bg-slate-800"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  hardware.rtxEnabled ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Simulates dynamic reflections, glossy anime lighting, and real-time shadow ambient occlusion.
          </p>
          <div className="text-[11px] font-mono text-cyan-300">
            Status: <strong>{hardware.rtxEnabled ? "ACTIVE (Ultra Reflections)" : "DISABLED"}</strong>
          </div>
        </div>

        {/* Path Tracing Toggle Card */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <Sparkles className="w-5 h-5" />
              <span>Full Path Tracing</span>
            </div>
            <button
              onClick={() => {
                sfx.playClick();
                updateHardware({ pathTracingEnabled: !hardware.pathTracingEnabled });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                hardware.pathTracingEnabled ? "bg-purple-500" : "bg-slate-800"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  hardware.pathTracingEnabled ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Full indirect global illumination and caustics shader rendering for maximum cinematic fidelity.
          </p>
          <div className="text-[11px] font-mono text-purple-300">
            Status: <strong>{hardware.pathTracingEnabled ? "ACTIVE (Path Traced)" : "OFF"}</strong>
          </div>
        </div>

        {/* AI Frame Generation (120 FPS) */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <Gauge className="w-5 h-5" />
              <span>AI Frame Gen (120 FPS)</span>
            </div>
            <button
              onClick={() => {
                sfx.playClick();
                updateHardware({
                  aiFrameGenEnabled: !hardware.aiFrameGenEnabled,
                  targetFps: !hardware.aiFrameGenEnabled ? 120 : 60,
                });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                hardware.aiFrameGenEnabled ? "bg-rose-500" : "bg-slate-800"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  hardware.aiFrameGenEnabled ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Generates interpolated intermediate AI frames to double motion smoothness up to 120 FPS.
          </p>
          <div className="text-[11px] font-mono text-rose-300">
            Target Output: <strong>{hardware.targetFps} FPS</strong>
          </div>
        </div>
      </div>

      {/* Hardware Telemetry Monitor */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-indigo-500/30 space-y-4">
        <h3 className="text-sm font-bold font-mono text-slate-200 uppercase flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Simulated Hardware Telemetry</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">GPU Core Temp</span>
            <strong className="text-rose-400 text-base">{hardware.simulatedGpuTemp}°C</strong>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">GPU Load</span>
            <strong className="text-cyan-400 text-base">{hardware.simulatedGpuUsage}%</strong>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">CPU Load</span>
            <strong className="text-purple-400 text-base">{hardware.simulatedCpuUsage}%</strong>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">VRAM Usage</span>
            <strong className="text-amber-400 text-base">{hardware.vramUsedGb} / 16 GB</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
