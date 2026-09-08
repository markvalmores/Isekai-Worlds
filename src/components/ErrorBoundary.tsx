import React, { Component, ErrorInfo, ReactNode } from "react";
import { ShieldAlert, RefreshCw, Home, Sparkles } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[Isekai Recovery System] React Error Boundary caught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleRecover = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      try {
        window.location.reload();
      } catch {}
    }
  };

  private handleResetToHome = () => {
    try {
      localStorage.removeItem("isekai_transient_error");
    } catch {}
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-8 select-none">
          <div className="max-w-xl w-full bg-slate-900 border-2 border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(168,85,247,0.25)] space-y-6 text-center backdrop-blur-xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-purple-600 to-rose-600 flex items-center justify-center shadow-lg shadow-purple-600/30 text-white">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-400/30 text-purple-300 text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>REALM AUTO-RECOVERY ACTIVE</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white">
                {this.props.fallbackTitle || "Dimensional Rift Intercepted"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-mono">
                The Isekai Worlds auto-stabilizer prevented a crash. Your session, profiles, and progression coins remain completely safe.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 text-left text-xs font-mono text-slate-400 overflow-x-auto max-h-32">
                <span className="text-rose-400 font-bold block mb-1">Safety Log:</span>
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleRecover}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Recover Realm</span>
              </button>

              <button
                onClick={this.handleResetToHome}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Return to Portal Hub</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
