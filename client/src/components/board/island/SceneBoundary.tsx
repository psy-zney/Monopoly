import React from 'react';

export class SceneBoundary extends React.Component<{ children: React.ReactNode; fallback?: React.ReactNode; onFallback?: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFallback?.(); }
  render() { return this.state.failed ? this.props.fallback ?? <div className="island-loading">Đang chuyển sang bản đồ…</div> : this.props.children; }
}
