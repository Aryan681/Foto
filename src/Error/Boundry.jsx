import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#0D0F11] text-white p-6 text-center">
          <h1 className="text-xl font-bold mb-2">Something went wrong.</h1>
          <p className="text-gray-400 text-sm mb-6">The neural engine encountered an unexpected interruption.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-500 rounded-xl font-bold active:scale-95 transition-all"
          >
            Reload System
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;