import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorState } from '@/shared/components/ui/ErrorState';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'An unexpected rendering error occurred.',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-surface-subtle p-6">
          <ErrorState
            title="Something went wrong"
            message={this.state.message}
            onRetry={() => {
              this.setState({ hasError: false, message: '' });
              window.location.reload();
            }}
            retryLabel="Reload page"
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
