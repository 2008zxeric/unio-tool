import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-2xl">
          <h2 className="text-rose-900 font-bold mb-2">调香空间加载异常</h2>
          <p className="text-rose-700 text-sm">抱歉，调香组件加载出现故障，请尝试刷新页面。</p>
        </div>
      );
    }

    return this.props.children;
  }
}
