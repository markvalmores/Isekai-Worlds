import React, { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import {
  Activity,
  BarChart2,
  Disc,
  Flame,
  Maximize2,
  Mic,
  MicOff,
  Minimize2,
  Music2,
  Palette,
  Radio,
  Sliders,
  Sparkles,
  Volume2,
  VolumeX,
  Zap
} from "lucide-react";
import { sfx } from "../utils/sfx";

export type VisualizerMode = "spectrum" | "radial" | "waveform" | "formant" | "particles";
export type ColorTheme = "miku" | "kagamine" | "luka" | "kaito" | "ia" | "rainbow";

interface VocaloidD3VisualizerProps {
  isPlaying: boolean;
  currentTime: number;
  bpm?: number;
  songTitle?: string;
  vocalist?: string;
  volume?: number;
  currentLyricLine?: string;
  isKaraokeMode?: boolean;
}

interface VisualizerThemeConfig {
  id: ColorTheme;
  name: string;
  character: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  glow: string;
  colorScale: (t: number) => string;
}

const THEMES: Record<ColorTheme, VisualizerThemeConfig> = {
  miku: {
    id: "miku",
    name: "Hatsune Miku",
    character: "初音ミク (01)",
    primary: "#39C5BB",
    secondary: "#00E5FF",
    accent: "#FF4081",
    background: "rgba(6, 26, 30, 0.7)",
    glow: "rgba(57, 197, 187, 0.6)",
    colorScale: d3.interpolateRgbBasis(["#0d9488", "#2dd4bf", "#38bdf8", "#ec4899", "#f43f5e"])
  },
  kagamine: {
    id: "kagamine",
    name: "Kagamine Rin & Len",
    character: "鏡音リン・レン (02)",
    primary: "#FFE600",
    secondary: "#FF9100",
    accent: "#FF3D00",
    background: "rgba(35, 27, 4, 0.7)",
    glow: "rgba(255, 230, 0, 0.6)",
    colorScale: d3.interpolateRgbBasis(["#eab308", "#facc15", "#fb923c", "#f97316", "#ef4444"])
  },
  luka: {
    id: "luka",
    name: "Megurine Luka",
    character: "巡音ルカ (03)",
    primary: "#FF598F",
    secondary: "#E040FB",
    accent: "#7C4DFF",
    background: "rgba(32, 7, 24, 0.7)",
    glow: "rgba(255, 89, 143, 0.6)",
    colorScale: d3.interpolateRgbBasis(["#db2777", "#f472b6", "#c084fc", "#a855f7", "#6366f1"])
  },
  kaito: {
    id: "kaito",
    name: "KAITO",
    character: "KAITO (CRV2)",
    primary: "#2979FF",
    secondary: "#00E5FF",
    accent: "#651FFF",
    background: "rgba(4, 18, 40, 0.7)",
    glow: "rgba(41, 121, 255, 0.6)",
    colorScale: d3.interpolateRgbBasis(["#2563eb", "#38bdf8", "#06b6d4", "#6366f1", "#4f46e5"])
  },
  ia: {
    id: "ia",
    name: "IA & GUMI",
    character: "ARIA ON THE PLANETES",
    primary: "#D946EF",
    secondary: "#A855F7",
    accent: "#10B981",
    background: "rgba(28, 9, 36, 0.7)",
    glow: "rgba(217, 70, 239, 0.6)",
    colorScale: d3.interpolateRgbBasis(["#a21caf", "#c084fc", "#e879f9", "#34d399", "#10b981"])
  },
  rainbow: {
    id: "rainbow",
    name: "Cyber Prism",
    character: "Vocaloid Spectrum",
    primary: "#06B6D4",
    secondary: "#EC4899",
    accent: "#EAB308",
    background: "rgba(10, 15, 30, 0.7)",
    glow: "rgba(6, 182, 212, 0.6)",
    colorScale: (t: number) => d3.interpolateTurbo(t * 0.85 + 0.1)
  }
};

const NUM_BANDS = 64;

export const VocaloidD3Visualizer: React.FC<VocaloidD3VisualizerProps> = ({
  isPlaying,
  currentTime,
  bpm = 135,
  songTitle = "Vocaloid Track",
  vocalist = "Hatsune Miku",
  volume = 80,
  currentLyricLine = "",
  isKaraokeMode = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Visualizer settings state
  const [mode, setMode] = useState<VisualizerMode>(() => {
    try {
      return (localStorage.getItem("isekai_viz_mode") as VisualizerMode) || "spectrum";
    } catch {
      return "spectrum";
    }
  });

  const [theme, setTheme] = useState<ColorTheme>(() => {
    try {
      return (localStorage.getItem("isekai_viz_theme") as ColorTheme) || "miku";
    } catch {
      return "miku";
    }
  });

  const [gain, setGain] = useState<number>(1.2);
  const [smoothing, setSmoothing] = useState<number>(0.8);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(false);

  // Web Audio API live microphone / tab capture state
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  // Peak history for gravity bounce animation
  const peakHistoryRef = useRef<number[]>(new Array(NUM_BANDS).fill(0));
  const peakVelocityRef = useRef<number[]>(new Array(NUM_BANDS).fill(0));
  const smoothedDataRef = useRef<number[]>(new Array(NUM_BANDS).fill(0));

  // Particle state for "particles" mode
  const particlesRef = useRef<
    Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      hue: number;
      life: number;
      maxLife: number;
    }>
  >([]);

  // Animation frame ref
  const animationFrameRef = useRef<number | null>(null);

  // Initialize or stop real audio capture
  const toggleMicCapture = async () => {
    sfx.playClick();
    if (isMicActive) {
      // Stop mic capture
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
        micStreamRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        await audioContextRef.current.close();
        audioContextRef.current = null;
      }
      analyserRef.current = null;
      setIsMicActive(false);
      setMicPermissionError(null);
    } else {
      try {
        setMicPermissionError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false
          }
        });
        micStreamRef.current = stream;

        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = smoothing;
        analyserRef.current = analyser;

        const source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);

        setIsMicActive(true);
        sfx.playBadgeUnlock();
      } catch (err) {
        console.warn("Microphone access not granted or unavailable:", err);
        setMicPermissionError("Audio input access denied or unavailable.");
        setIsMicActive(false);
      }
    }
  };

  // Clean up audio context and mic stream on unmount
  useEffect(() => {
    return () => {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Sync mode and theme persistence
  const changeMode = (newMode: VisualizerMode) => {
    sfx.playClick();
    setMode(newMode);
    try {
      localStorage.setItem("isekai_viz_mode", newMode);
    } catch {}
  };

  const changeTheme = (newTheme: ColorTheme) => {
    sfx.playClick();
    setTheme(newTheme);
    try {
      localStorage.setItem("isekai_viz_theme", newTheme);
    } catch {}
  };

  // Algorithmic Vocaloid audio synthesizer when real mic capture is off
  // Simulates realistic multi-band frequency FFT values derived from song playback, BPM, beat pulses, formant vocal curves & lyric intensity
  const generateSimulatedFrequencyData = useCallback(
    (time: number, isSinging: boolean): number[] => {
      const data: number[] = new Array(NUM_BANDS);
      const beatInterval = 60 / (bpm || 135);
      const beatFraction = (time % beatInterval) / beatInterval;
      // Exponential decay kick pulse on each quarter beat
      const kickPulse = Math.max(0, Math.exp(-beatFraction * 5.0));
      // Snare on 2nd and 4th beats
      const beatIndex = Math.floor(time / beatInterval) % 4;
      const isSnareBeat = beatIndex === 1 || beatIndex === 3;
      const snarePulse = isSnareBeat ? Math.max(0, Math.exp(-beatFraction * 4.5)) * 0.8 : 0;
      // Hi-hat 16th notes
      const hihatFraction = (time % (beatInterval / 4)) / (beatInterval / 4);
      const hihatPulse = Math.max(0, Math.exp(-hihatFraction * 7.0)) * 0.6;

      // Vocaloid vocal resonance peak frequencies:
      // Formant F1 (~600-800Hz), F2 (~1400-2200Hz), F3 (~2800-3600Hz)
      const vocalIntensity = isSinging ? 0.9 : 0.25;
      const vocalPhase = time * 8.0;

      for (let i = 0; i < NUM_BANDS; i++) {
        const normalizedIndex = i / NUM_BANDS;
        const freqHz = 20 * Math.pow(20000 / 20, normalizedIndex);

        let bandEnergy = 0;

        // 1. Sub-Bass & Bass (0 - 250 Hz, bands 0 to 12)
        if (i < 12) {
          const bassWeight = 1 - i / 12;
          bandEnergy += (kickPulse * 0.95 + 0.25 * Math.sin(time * 6 + i * 0.3)) * bassWeight;
        }

        // 2. Low-Mids & Snare (250 - 1000 Hz, bands 12 to 24)
        if (i >= 10 && i < 26) {
          const midWeight = Math.sin(((i - 10) / 16) * Math.PI);
          bandEnergy += (snarePulse * 0.85 + 0.3 * Math.sin(time * 12 + i * 0.5)) * midWeight;
        }

        // 3. Vocaloid Formant Region (1000 - 4500 Hz, bands 24 to 45)
        if (i >= 22 && i < 48) {
          const f1Dist = Math.abs(freqHz - (800 + Math.sin(vocalPhase) * 200));
          const f2Dist = Math.abs(freqHz - (2000 + Math.cos(vocalPhase * 1.3) * 400));
          const f3Dist = Math.abs(freqHz - (3400 + Math.sin(vocalPhase * 0.8) * 300));

          const f1Peak = Math.exp(-Math.pow(f1Dist / 350, 2)) * 0.9;
          const f2Peak = Math.exp(-Math.pow(f2Dist / 600, 2)) * 0.85;
          const f3Peak = Math.exp(-Math.pow(f3Dist / 800, 2)) * 0.75;

          bandEnergy += (f1Peak + f2Peak + f3Peak) * vocalIntensity;
        }

        // 4. Treble & Presence / Hi-Hats (4500 - 18000 Hz, bands 45 to 64)
        if (i >= 42) {
          const trebleWeight = (i - 42) / (NUM_BANDS - 42);
          bandEnergy += (hihatPulse * 0.75 + 0.2 * Math.sin(time * 24 + i)) * trebleWeight;
        }

        // Add subtle harmonic pink noise floor
        const noise = 0.08 * (Math.sin(time * 30 + i * 1.7) * 0.5 + 0.5);
        bandEnergy += noise;

        // Apply volume attenuation
        const volScale = Math.max(0.1, (volume || 80) / 100);
        const finalVal = Math.min(255, Math.max(0, bandEnergy * 255 * gain * volScale));
        data[i] = finalVal;
      }

      return data;
    },
    [bpm, gain, volume]
  );

  // Main D3 Render Loop
  useEffect(() => {
    const svgElement = svgRef.current;
    const container = containerRef.current;
    if (!svgElement || !container) return;

    const svg = d3.select(svgElement);
    const themeConfig = THEMES[theme] || THEMES.miku;

    let width = container.clientWidth || 600;
    let height = container.clientHeight || 200;

    // Resize observer to update width and height fluidly
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = entry.contentRect.width || 600;
        height = entry.contentRect.height || 200;
      }
    });
    resizeObserver.observe(container);

    // D3 Filter & Gradient Definitions setup
    let defs = svg.select<SVGDefsElement>("defs");
    if (defs.empty()) {
      defs = svg.append("defs");
    }
    defs.selectAll("*").remove();

    // 1. Neon Glow Filter
    const filter = defs.append("filter").attr("id", "neon-glow").attr("x", "-40%").attr("y", "-40%").attr("width", "180%").attr("height", "180%");
    filter.append("feGaussianBlur").attr("stdDeviation", "4").attr("result", "blur1");
    filter.append("feGaussianBlur").attr("stdDeviation", "8").attr("result", "blur2");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "blur2");
    feMerge.append("feMergeNode").attr("in", "blur1");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // 2. Bar Vertical Linear Gradient
    const barGrad = defs.append("linearGradient").attr("id", "viz-bar-grad").attr("x1", "0%").attr("y1", "100%").attr("x2", "0%").attr("y2", "0%");
    barGrad.append("stop").attr("offset", "0%").attr("stop-color", themeConfig.primary).attr("stop-opacity", 0.3);
    barGrad.append("stop").attr("offset", "60%").attr("stop-color", themeConfig.secondary).attr("stop-opacity", 0.85);
    barGrad.append("stop").attr("offset", "100%").attr("stop-color", themeConfig.accent).attr("stop-opacity", 1);

    // 3. Radial Gradient for Core
    const radialGrad = defs.append("radialGradient").attr("id", "viz-core-grad");
    radialGrad.append("stop").attr("offset", "0%").attr("stop-color", themeConfig.primary).attr("stop-opacity", 0.6);
    radialGrad.append("stop").attr("offset", "60%").attr("stop-color", themeConfig.secondary).attr("stop-opacity", 0.2);
    radialGrad.append("stop").attr("offset", "100%").attr("stop-color", "transparent").attr("stop-opacity", 0);

    // Setup main container group
    let mainGroup = svg.select<SVGGElement>("g.main-group");
    if (mainGroup.empty()) {
      mainGroup = svg.append("g").attr("class", "main-group");
    }

    const byteData = new Uint8Array(analyserRef.current ? analyserRef.current.frequencyBinCount : 128);

    // Animation render tick
    const render = () => {
      width = container.clientWidth || 600;
      height = container.clientHeight || 200;

      svg.attr("viewBox", `0 0 ${width} ${height}`);

      let rawFrequencies: number[] = [];

      if (isMicActive && analyserRef.current) {
        analyserRef.current.getByteFrequencyData(byteData);
        // Downsample to NUM_BANDS
        const step = Math.max(1, Math.floor(byteData.length / NUM_BANDS));
        for (let i = 0; i < NUM_BANDS; i++) {
          const idx = Math.min(byteData.length - 1, i * step);
          rawFrequencies.push(byteData[idx] * gain);
        }
      } else if (isPlaying) {
        const isSinging = Boolean(currentLyricLine && currentLyricLine.trim().length > 0);
        rawFrequencies = generateSimulatedFrequencyData(currentTime, isSinging);
      } else {
        // Idle ambient gentle wave
        const idleTime = performance.now() / 1000;
        rawFrequencies = Array.from({ length: NUM_BANDS }, (_, i) => {
          return (Math.sin(idleTime * 2 + i * 0.2) * 0.5 + 0.5) * 25 + (Math.cos(idleTime * 1.5 - i * 0.1) * 0.5 + 0.5) * 15;
        });
      }

      // Smooth data with exponential decay
      const smoothed = smoothedDataRef.current;
      const peaks = peakHistoryRef.current;
      const velocities = peakVelocityRef.current;
      const gravity = 0.55;

      for (let i = 0; i < NUM_BANDS; i++) {
        const target = rawFrequencies[i] || 0;
        smoothed[i] = smoothed[i] * smoothing + target * (1 - smoothing);

        // Peak physics
        if (smoothed[i] >= peaks[i]) {
          peaks[i] = smoothed[i];
          velocities[i] = 0;
        } else {
          velocities[i] += gravity;
          peaks[i] = Math.max(0, peaks[i] - velocities[i]);
        }
      }

      mainGroup.selectAll("*").remove();

      // ==========================================
      // MODE 1: SPECTRUM BARS & NEON PEAK CAPS
      // ==========================================
      if (mode === "spectrum") {
        const barPadding = 2;
        const totalBarWidth = width - 40;
        const barWidth = Math.max(2, (totalBarWidth / NUM_BANDS) - barPadding);
        const startX = 20;
        const baselineY = height - 25;
        const maxHeight = height - 55;

        const yScale = d3.scaleLinear().domain([0, 255]).range([0, maxHeight]);

        // Draw frequency bands
        for (let i = 0; i < NUM_BANDS; i++) {
          const x = startX + i * (barWidth + barPadding);
          const barH = Math.max(2, yScale(smoothed[i]));
          const y = baselineY - barH;
          const peakH = yScale(peaks[i]);
          const peakY = Math.max(10, baselineY - peakH);

          // Bar Rect
          mainGroup
            .append("rect")
            .attr("x", x)
            .attr("y", y)
            .attr("width", barWidth)
            .attr("height", barH)
            .attr("rx", Math.min(3, barWidth / 2))
            .attr("fill", themeConfig.colorScale(i / NUM_BANDS))
            .attr("opacity", 0.85);

          // Reflection underneath
          mainGroup
            .append("rect")
            .attr("x", x)
            .attr("y", baselineY + 2)
            .attr("width", barWidth)
            .attr("height", Math.min(18, barH * 0.35))
            .attr("rx", 1)
            .attr("fill", themeConfig.colorScale(i / NUM_BANDS))
            .attr("opacity", 0.18);

          // Peak Cap dot/line
          if (peakH > 4) {
            mainGroup
              .append("rect")
              .attr("x", x)
              .attr("y", peakY - 3)
              .attr("width", barWidth)
              .attr("height", 2)
              .attr("rx", 1)
              .attr("fill", "#FFFFFF")
              .attr("filter", "url(#neon-glow)")
              .attr("opacity", 0.95);
          }
        }

        // Baseline glow axis
        mainGroup
          .append("line")
          .attr("x1", startX)
          .attr("y1", baselineY)
          .attr("x2", startX + NUM_BANDS * (barWidth + barPadding))
          .attr("y2", baselineY)
          .attr("stroke", themeConfig.primary)
          .attr("stroke-width", 1.5)
          .attr("opacity", 0.5)
          .attr("filter", "url(#neon-glow)");
      }

      // ==========================================
      // MODE 2: CIRCULAR RADIAL CYBER HALO
      // ==========================================
      else if (mode === "radial") {
        const centerX = width / 2;
        const centerY = height / 2;
        const innerRadius = Math.min(width, height) * 0.18;
        const maxRadius = Math.min(width, height) * 0.42;

        const angleScale = d3
          .scaleLinear()
          .domain([0, NUM_BANDS])
          .range([0, 2 * Math.PI]);

        const rScale = d3
          .scaleLinear()
          .domain([0, 255])
          .range([innerRadius, maxRadius]);

        // Background Core Pulsing Disc
        const avgEnergy = d3.mean(smoothed) || 0;
        const coreScale = 1 + (avgEnergy / 255) * 0.35;

        mainGroup
          .append("circle")
          .attr("cx", centerX)
          .attr("cy", centerY)
          .attr("r", innerRadius * 0.95 * coreScale)
          .attr("fill", "url(#viz-core-grad)")
          .attr("filter", "url(#neon-glow)");

        // Inner decorative reticle
        mainGroup
          .append("circle")
          .attr("cx", centerX)
          .attr("cy", centerY)
          .attr("r", innerRadius * 0.8)
          .attr("fill", "none")
          .attr("stroke", themeConfig.primary)
          .attr("stroke-width", 1)
          .attr("stroke-dasharray", "4 6")
          .attr("opacity", 0.6);

        // Center Vocaloid Logo Icon or text
        mainGroup
          .append("text")
          .attr("x", centerX)
          .attr("y", centerY - 2)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("fill", themeConfig.primary)
          .attr("font-family", "monospace")
          .attr("font-size", `${Math.max(10, innerRadius * 0.32)}px`)
          .attr("font-weight", "bold")
          .text(themeConfig.character.split(" ")[0]);

        mainGroup
          .append("text")
          .attr("x", centerX)
          .attr("y", centerY + 14)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("fill", "#94A3B8")
          .attr("font-family", "monospace")
          .attr("font-size", "9px")
          .text(`${Math.round(avgEnergy * (100 / 255))}% PWR`);

        // Radial Bars & Glowing Spikes
        for (let i = 0; i < NUM_BANDS; i++) {
          const angle = angleScale(i) - Math.PI / 2;
          const val = smoothed[i];
          const r = rScale(val);

          const x1 = centerX + Math.cos(angle) * innerRadius;
          const y1 = centerY + Math.sin(angle) * innerRadius;
          const x2 = centerX + Math.cos(angle) * r;
          const y2 = centerY + Math.sin(angle) * r;

          mainGroup
            .append("line")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)
            .attr("stroke", themeConfig.colorScale(i / NUM_BANDS))
            .attr("stroke-width", Math.max(1.5, (2 * Math.PI * innerRadius) / NUM_BANDS - 1))
            .attr("stroke-linecap", "round")
            .attr("opacity", 0.85);

          // Peak Orb
          const peakR = rScale(peaks[i]);
          const px = centerX + Math.cos(angle) * (peakR + 3);
          const py = centerY + Math.sin(angle) * (peakR + 3);

          if (val > 20) {
            mainGroup
              .append("circle")
              .attr("cx", px)
              .attr("cy", py)
              .attr("r", 1.8)
              .attr("fill", "#FFFFFF")
              .attr("filter", "url(#neon-glow)");
          }
        }
      }

      // ==========================================
      // MODE 3: OSCILLOSCOPE CYBER WAVE
      // ==========================================
      else if (mode === "waveform") {
        const centerY = height / 2;
        const amplitude = (height / 2) - 30;

        const xScale = d3.scaleLinear().domain([0, NUM_BANDS - 1]).range([20, width - 20]);
        const yScale = d3.scaleLinear().domain([0, 255]).range([0, amplitude]);

        // Construct 3 distinct harmonic waves
        const timeNow = performance.now() / 300;

        const pointsWave1: [number, number][] = smoothed.map((val, i) => {
          const offset = Math.sin(timeNow + i * 0.2) * (val / 255) * 15;
          const y = centerY - yScale(val) + offset;
          return [xScale(i), y];
        });

        const pointsWaveMirror: [number, number][] = smoothed.map((val, i) => {
          const offset = Math.sin(timeNow + i * 0.2 + Math.PI) * (val / 255) * 15;
          const y = centerY + yScale(val) + offset;
          return [xScale(i), y];
        });

        const lineGen = d3
          .line<[number, number]>()
          .x((d) => d[0])
          .y((d) => d[1])
          .curve(d3.curveBasis);

        // Gradient filled area between waves
        const areaGen = d3
          .area<number>()
          .x((_, i) => xScale(i))
          .y0((d, i) => pointsWave1[i][1])
          .y1((d, i) => pointsWaveMirror[i][1])
          .curve(d3.curveBasis);

        mainGroup
          .append("path")
          .datum(smoothed)
          .attr("d", areaGen)
          .attr("fill", "url(#viz-bar-grad)")
          .attr("opacity", 0.35);

        // Top Harmonic Curve
        mainGroup
          .append("path")
          .datum(pointsWave1)
          .attr("d", lineGen)
          .attr("fill", "none")
          .attr("stroke", themeConfig.secondary)
          .attr("stroke-width", 2.5)
          .attr("filter", "url(#neon-glow)");

        // Bottom Harmonic Mirror Curve
        mainGroup
          .append("path")
          .datum(pointsWaveMirror)
          .attr("d", lineGen)
          .attr("fill", "none")
          .attr("stroke", themeConfig.accent)
          .attr("stroke-width", 2.5)
          .attr("filter", "url(#neon-glow)");

        // Center line
        mainGroup
          .append("line")
          .attr("x1", 20)
          .attr("y1", centerY)
          .attr("x2", width - 20)
          .attr("y2", centerY)
          .attr("stroke", themeConfig.primary)
          .attr("stroke-width", 1)
          .attr("stroke-dasharray", "2 4")
          .attr("opacity", 0.4);
      }

      // ==========================================
      // MODE 4: VOCAL FORMANT & PITCH MATRIX
      // ==========================================
      else if (mode === "formant") {
        const padding = 25;
        const plotW = width - padding * 2;
        const plotH = height - 50;

        // Vowel Formant Regions (F1 vs F2)
        const formants = [
          { name: "あ (A)", f1: 750, f2: 1250, color: "#FF598F" },
          { name: "い (I)", f1: 250, f2: 2400, color: "#39C5BB" },
          { name: "う (U)", f1: 350, f2: 1300, color: "#FFE600" },
          { name: "え (E)", f1: 500, f2: 1900, color: "#00E5FF" },
          { name: "お (O)", f1: 500, f2: 900, color: "#D946EF" }
        ];

        // Background formant zones
        formants.forEach((f, idx) => {
          const fx = padding + (idx / formants.length) * plotW + plotW / (formants.length * 2);
          const energy = (smoothed[idx * 12 + 10] || 40) / 255;
          const fy = height - 35 - energy * plotH * 0.85;

          // Connecting resonance line
          mainGroup
            .append("line")
            .attr("x1", fx)
            .attr("y1", height - 35)
            .attr("x2", fx)
            .attr("y2", fy)
            .attr("stroke", f.color)
            .attr("stroke-width", 2)
            .attr("opacity", 0.7);

          // Glowing Formant Node
          mainGroup
            .append("circle")
            .attr("cx", fx)
            .attr("cy", fy)
            .attr("r", 6 + energy * 16)
            .attr("fill", f.color)
            .attr("opacity", 0.85)
            .attr("filter", "url(#neon-glow)");

          // Vowel Kana label
          mainGroup
            .append("text")
            .attr("x", fx)
            .attr("y", height - 15)
            .attr("text-anchor", "middle")
            .attr("fill", "#FFFFFF")
            .attr("font-family", "monospace")
            .attr("font-size", "11px")
            .attr("font-weight", "bold")
            .text(f.name);

          // Formant value
          mainGroup
            .append("text")
            .attr("x", fx)
            .attr("y", fy - 10)
            .attr("text-anchor", "middle")
            .attr("fill", f.color)
            .attr("font-family", "monospace")
            .attr("font-size", "9px")
            .text(`${Math.round(energy * 100)}%`);
        });

        // Overlay line graph of full frequency curve
        const xScale = d3.scaleLinear().domain([0, NUM_BANDS - 1]).range([padding, width - padding]);
        const yScale = d3.scaleLinear().domain([0, 255]).range([height - 35, 20]);

        const lineGen = d3
          .line<number>()
          .x((_, i) => xScale(i))
          .y((d) => yScale(d))
          .curve(d3.curveCatmullRom);

        mainGroup
          .append("path")
          .datum(smoothed)
          .attr("d", lineGen)
          .attr("fill", "none")
          .attr("stroke", themeConfig.primary)
          .attr("stroke-width", 2)
          .attr("opacity", 0.6)
          .attr("filter", "url(#neon-glow)");
      }

      // ==========================================
      // MODE 5: STARDUST PARTICLE SHOCKWAVE
      // ==========================================
      else if (mode === "particles") {
        const centerX = width / 2;
        const centerY = height / 2;
        const particles = particlesRef.current;
        const avgEnergy = (d3.mean(smoothed) || 0) / 255;

        // Emit new particles based on beat energy
        if (avgEnergy > 0.25 || isPlaying) {
          const spawnCount = Math.floor(avgEnergy * 6) + 1;
          for (let p = 0; p < spawnCount; p++) {
            const angle = Math.random() * 2 * Math.PI;
            const speed = 1.5 + Math.random() * 4.5 * avgEnergy;
            particles.push({
              x: centerX,
              y: centerY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size: 2 + Math.random() * 4 * avgEnergy,
              hue: Math.random(),
              life: 1.0,
              maxLife: 35 + Math.random() * 25
            });
          }
        }

        // Limit particles pool
        if (particles.length > 150) {
          particles.splice(0, particles.length - 150);
        }

        // Update & Render particles
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 1 / p.maxLife;

          if (p.life <= 0 || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
            particles.splice(i, 1);
            continue;
          }

          mainGroup
            .append("circle")
            .attr("cx", p.x)
            .attr("cy", p.y)
            .attr("r", p.size * p.life)
            .attr("fill", themeConfig.colorScale(p.hue))
            .attr("opacity", p.life * 0.9)
            .attr("filter", "url(#neon-glow)");
        }

        // Center Vocaloid Core Ring
        mainGroup
          .append("circle")
          .attr("cx", centerX)
          .attr("cy", centerY)
          .attr("r", 20 + avgEnergy * 30)
          .attr("fill", "none")
          .attr("stroke", themeConfig.primary)
          .attr("stroke-width", 2)
          .attr("opacity", 0.8)
          .attr("filter", "url(#neon-glow)");
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [mode, theme, gain, smoothing, isPlaying, currentTime, isMicActive, generateSimulatedFrequencyData]);

  const currentThemeConfig = THEMES[theme] || THEMES.miku;

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-3xl overflow-hidden transition-all duration-300 border shadow-2xl backdrop-blur-xl ${
        isExpanded ? "fixed inset-4 z-50 bg-slate-950/95 flex flex-col" : "bg-slate-900/90"
      } ${
        isKaraokeMode
          ? "border-teal-400 shadow-[0_0_30px_rgba(20,184,166,0.3)]"
          : "border-teal-500/30"
      }`}
      style={{
        background: `radial-gradient(ellipse at bottom, ${currentThemeConfig.background} 0%, rgba(15, 23, 42, 0.95) 75%)`
      }}
    >
      {/* Top Header / Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-teal-500/10 border border-teal-400/40 text-teal-300 shadow-sm">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-white tracking-tight uppercase">D3.js Audio Visualizer</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-teal-500/20 text-teal-300 border border-teal-400/30">
                {currentThemeConfig.character}
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400">
              {isMicActive
                ? "🎙️ Live Microphone / System Input FFT Spectrum"
                : isPlaying
                ? `⚡ Reactive Track Sync: ${songTitle}`
                : "Standby / Idle Harmonic Pulse"}
            </p>
          </div>
        </div>

        {/* Right Header Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Real Mic / System Capture Toggle */}
          <button
            onClick={toggleMicCapture}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold transition-all flex items-center gap-1.5 border shadow-sm ${
              isMicActive
                ? "bg-pink-500 text-white border-pink-400 ring-2 ring-pink-400/40 animate-pulse"
                : "bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-teal-400"
            }`}
            title={isMicActive ? "Disable Live Microphone / Audio Capture" : "Enable Real Microphone / System Audio Capture (Web Audio API Analyser)"}
          >
            {isMicActive ? <Mic className="w-3 h-3 text-white" /> : <MicOff className="w-3 h-3 text-slate-400" />}
            <span className="hidden sm:inline">{isMicActive ? "Mic: ON" : "Mic Input"}</span>
          </button>

          {/* Controls Menu Toggle */}
          <button
            onClick={() => {
              sfx.playClick();
              setShowControls(!showControls);
            }}
            className={`p-1.5 rounded-xl border text-xs transition-all ${
              showControls
                ? "bg-teal-500 text-slate-950 border-teal-400 font-bold"
                : "bg-slate-900 border-slate-700 text-slate-300 hover:text-white"
            }`}
            title="Adjust Visualizer Settings (Sensitivity, Themes, Presets)"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          {/* Expand / Minimize Fullscreen */}
          <button
            onClick={() => {
              sfx.playClick();
              setIsExpanded(!isExpanded);
            }}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all text-xs"
            title={isExpanded ? "Collapse Visualizer" : "Expand Fullscreen"}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Permission error warning if any */}
      {micPermissionError && (
        <div className="px-4 py-1.5 bg-rose-950/80 border-b border-rose-800/80 text-[11px] font-mono text-rose-300 flex items-center justify-between">
          <span>⚠️ {micPermissionError}</span>
          <button
            onClick={() => setMicPermissionError(null)}
            className="text-xs text-rose-200 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Settings / Controls Drawer */}
      {showControls && (
        <div className="p-4 bg-slate-950/90 border-b border-slate-800/80 space-y-3 animate-fadeIn text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Visualizer Presets */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold flex items-center gap-1">
                <BarChart2 className="w-3 h-3 text-teal-400" /> Mode Preset
              </label>
              <div className="grid grid-cols-2 gap-1">
                {(
                  [
                    { id: "spectrum", label: "Spectrum" },
                    { id: "radial", label: "Halo Ring" },
                    { id: "waveform", label: "Oscilloscope" },
                    { id: "formant", label: "Formant" },
                    { id: "particles", label: "Particles" }
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => changeMode(m.id)}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all text-left ${
                      mode === m.id
                        ? "bg-teal-500 text-slate-950 shadow-sm"
                        : "bg-slate-900 hover:bg-slate-800 text-slate-300"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Themes */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold flex items-center gap-1">
                <Palette className="w-3 h-3 text-pink-400" /> Color Theme
              </label>
              <div className="grid grid-cols-2 gap-1">
                {Object.values(THEMES).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => changeTheme(t.id)}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all text-left flex items-center gap-1.5 ${
                      theme === t.id
                        ? "bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 font-black shadow-sm"
                        : "bg-slate-900 hover:bg-slate-800 text-slate-300"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.primary }} />
                    <span className="truncate">{t.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sensitivity Gain Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-400" /> Gain / Sensitivity
                </span>
                <span className="text-teal-300 font-bold">{gain.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={gain}
                onChange={(e) => setGain(parseFloat(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500">
                <span>0.5x Subtle</span>
                <span>1.2x Default</span>
                <span>2.5x Hyper</span>
              </div>
            </div>

            {/* Smoothing Factor */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-bold flex items-center gap-1">
                  <Flame className="w-3 h-3 text-cyan-400" /> Smoothing
                </span>
                <span className="text-teal-300 font-bold">{Math.round(smoothing * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="0.95"
                step="0.05"
                value={smoothing}
                onChange={(e) => setSmoothing(parseFloat(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500">
                <span>Fast Attack</span>
                <span>Smooth Glide</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visualizer Mode Tabs Ribbon */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-slate-950/40 border-b border-slate-800/50 text-[11px] font-mono">
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {(
            [
              { id: "spectrum", label: "EQ Spectrum", icon: BarChart2 },
              { id: "radial", label: "Cyber Halo", icon: Disc },
              { id: "waveform", label: "Oscilloscope", icon: Activity },
              { id: "formant", label: "Formant Matrix", icon: Radio },
              { id: "particles", label: "Particle Field", icon: Sparkles }
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            const isActive = mode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => changeMode(item.id)}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 text-[10px] font-bold ${
                  isActive
                    ? "bg-teal-500/20 text-teal-300 border border-teal-400/40 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Icon className={`w-3 h-3 ${isActive ? "text-teal-300" : "text-slate-500"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live Lyrics Syllable Resonance Display */}
        {currentLyricLine && (
          <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono text-pink-300 truncate max-w-xs animate-fadeIn">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
            <span className="truncate italic">"{currentLyricLine}"</span>
          </div>
        )}
      </div>

      {/* Main SVG Visualization Canvas */}
      <div className={`relative w-full ${isExpanded ? "flex-1 min-h-[450px]" : "h-44 sm:h-52"}`}>
        <svg
          ref={svgRef}
          className="w-full h-full block"
          style={{ overflow: "visible" }}
        />
      </div>

      {/* Footer Info & Frequency Labels */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-slate-950/70 border-t border-slate-800/60 text-[9px] font-mono text-slate-500">
        <div className="flex items-center gap-3">
          <span>20 Hz (Sub-Bass)</span>
          <span className="hidden sm:inline">250 Hz (Mids)</span>
          <span className="text-teal-400 font-bold">1 kHz - 4 kHz (Vocaloid Resonance)</span>
          <span className="hidden sm:inline">8 kHz (Treble)</span>
          <span>20 kHz (Air)</span>
        </div>
        <div className="flex items-center gap-2">
          <span>FFT 64-Band</span>
          <span>D3.js v7</span>
        </div>
      </div>
    </div>
  );
};
