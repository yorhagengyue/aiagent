import { useState, useEffect } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme, Alert } from '@mui/material';
import { TaskInput } from './components/TaskInput';
import { TaskOutput } from './components/TaskOutput';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ActionResult } from './types/agent';
import { motion } from 'framer-motion';
import { wsClient } from './services/websocket';
import '@fontsource/roboto-mono/400.css';
import '@fontsource/roboto-mono/700.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4F46E5',
    },
    secondary: {
      main: '#7C3AED',
    },
    background: {
      default: '#111827',
      paper: '#1F2937',
    },
  },
  typography: {
    fontFamily: '"Roboto Mono", monospace',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  const [results, setResults] = useState<ActionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const handleTaskUpdate = (update: { result: ActionResult }) => {
      setResults(prev => [...prev, update.result]);
    };

    const handleTaskComplete = (complete: { results: ActionResult[] }) => {
      setResults(complete.results);
      setLoading(false);
    };

    wsClient.subscribeToTaskUpdates('', handleTaskUpdate);
    wsClient.subscribeToTaskComplete('', handleTaskComplete);

    return () => {
      wsClient.unsubscribeFromTaskUpdates();
      wsClient.unsubscribeFromTaskComplete();
    };
  }, []);

  const handleSubmit = async (task: string, apiKey: string) => {
    try {
      setLoading(true);
      setError(undefined);
      setResults([]);

      const response = await fetch(`/api/agent/task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task, apiKey }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to start task');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <ErrorBoundary>
            <TaskInput onSubmit={handleSubmit} loading={loading} />
            {error && (
              <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                {error}
              </Alert>
            )}
            <TaskOutput
              results={results}
              loading={loading}
              error={error}
            />
          </ErrorBoundary>
        </Container>
      </motion.div>
    </ThemeProvider>
  );
}

export default App;
