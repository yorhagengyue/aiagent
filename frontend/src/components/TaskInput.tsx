import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import '@mui/material/styles';

interface TaskInputProps {
  onSubmit: (task: string, apiKey: string) => void;
}

export const TaskInput = ({ onSubmit }: TaskInputProps) => {
  const [task, setTask] = useState('');
  const [apiKey, setApiKey] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{
          background: 'linear-gradient(45deg, #4F46E5, #7C3AED)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          fontWeight: 'bold'
        }}>
          YoRHa AI Agent
        </Typography>

        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <TextField
            fullWidth
            type="password"
            label="OpenAI API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            margin="normal"
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Task Description"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            margin="normal"
            variant="outlined"
            placeholder="Enter your task description..."
            sx={{ mb: 3 }}
          />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            fullWidth
            variant="contained"
            onClick={() => onSubmit(task, apiKey)}
            sx={{
              background: 'linear-gradient(45deg, #4F46E5, #7C3AED)',
              color: 'white',
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': {
                background: 'linear-gradient(45deg, #4338CA, #6D28D9)'
              }
            }}
          >
            Start Task
          </Button>
        </motion.div>
      </Box>
    </motion.div>
  );
};
