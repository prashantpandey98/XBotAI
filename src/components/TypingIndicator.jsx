import { Box, Typography, Paper } from '@mui/material';
import { keyframes } from '@mui/system';

const bounce = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
`;

const TypingIndicator = () => {
  const getAIAvatar = () => (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: 'linear-gradient(45deg, #9c88ff, #6c5ce7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
        AI
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        mb: 3,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 1,
      }}
    >
      {getAIAvatar()}
      
      <Box sx={{ maxWidth: '70%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
            <span>Soul AI</span>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            typing...
          </Typography>
        </Box>

        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 3,
            backgroundColor: '#f5f5f5',
            color: '#333',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {[0, 1, 2].map((index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#9c88ff',
                  animation: `${bounce} 1.4s infinite ease-in-out`,
                  animationDelay: `${index * 0.16}s`,
                }}
              />
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default TypingIndicator;
