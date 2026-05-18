import { Component } from 'react';

/**
 * Catches render-time errors in the component tree below and shows a
 * user-friendly fallback instead of a blank screen.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to console in dev; replace with a remote logger in production
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <div
            className="glass-panel"
            style={{
              padding: '2.5rem',
              maxWidth: '480px',
              width: '100%',
            }}
          >
            <h2
              className="gradient-text"
              style={{ fontSize: '1.5rem', margin: '0 0 1rem', fontFamily: 'var(--font-display)' }}
            >
              Something went wrong
            </h2>
            <p style={{ color: 'var(--text-muted)', margin: '0 0 1.5rem', fontSize: '0.95rem', lineHeight: 1.5 }}>
              An unexpected error occurred. You can try refreshing the page or navigating back.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn--primary" onClick={this.handleReset}>
                Try again
              </button>
              <button className="btn btn--ghost" onClick={() => (window.location.href = '/')}>
                Go home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
