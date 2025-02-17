import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              p: 4,
              bgcolor: '#FEF2F2',
              borderRadius: 2,
              border: '1px solid #EF4444',
              maxWidth: 600,
              mx: 'auto',
              mt: 4,
              textAlign: 'center'
            }}
          >
            <Typography variant="h5" color="error" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {this.state.error?.message}
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                color="error"
                onClick={() => window.location.reload()}
                sx={{
                  background: 'linear-gradient(45deg, #DC2626, #EF4444)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #B91C1C, #DC2626)'
                  }
                }}
              >
                Reload Page
              </Button>
            </motion.div>
          </Box>
        </motion.div>
      );
    }

    return this.props.children;
  }
}
