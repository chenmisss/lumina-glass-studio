import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 text-white p-4">
                    <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-center mb-2">出了一点小状况</h2>
                        <p className="text-slate-300 text-center mb-6 text-sm">
                            应用遇到了意外错误。这通常是暂时性的，刷新页面可能解决问题。
                        </p>

                        <div className="bg-black/30 rounded p-4 mb-6 overflow-auto max-h-32 text-xs font-mono text-red-300">
                            {this.state.error?.toString()}
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all active:scale-95"
                        >
                            刷新页面
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
