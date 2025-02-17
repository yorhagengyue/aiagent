import React from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ActionResult } from '../types/agent';

interface TaskOutputProps {
  results: ActionResult[];
  loading?: boolean;
  error?: string;
}

export const TaskOutput: React.FC<TaskOutputProps> = ({ results, loading, error }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: 'center', marginBottom: '2rem' }}
          >
            <CircularProgress
              sx={{
                color: '#4F46E5',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }}
            />
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Paper
              sx={{
                p: 2,
                bgcolor: '#FEE2E2',
                border: '1px solid #EF4444',
                borderRadius: 2,
                mb: 3
              }}
            >
              <Typography color="error" variant="body1">
                {error}
              </Typography>
            </Paper>
          </motion.div>
        )}

        {results.map((result, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Paper
              sx={{
                p: 3,
                mb: 2,
                background: result.isDone
                  ? 'linear-gradient(135deg, #047857, #059669)'
                  : 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                color: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                },
                '&:hover::before': {
                  opacity: 1,
                },
              }}
            >
              <Typography variant="body1" sx={{ mb: result.error ? 2 : 0 }}>
                {result.extractedContent}
              </Typography>
              {result.error && (
                <Typography
                  variant="body2"
                  sx={{
                    color: '#FEE2E2',
                    mt: 1,
                    fontStyle: 'italic'
                  }}
                >
                  Error: {result.error}
                </Typography>
              )}
            </Paper>
          </motion.div>
        ))}
      </AnimatePresence>
    </Box>
  );
};
