import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Rating,
  IconButton,
} from '@mui/material';
import feedbackImage  from '../assets/feedbackImage.png'
import {
  Star,
  StarBorder,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useApp } from '../context/AppContext';

const ConversationEndDialog = ({ open, onClose, onComplete }) => {
  const { actions } = useApp();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [step, setStep] = useState(1);

  const handleRatingSubmit = () => {
    if (rating > 0) {
      actions.addConversationRating(rating);
      setStep(2);
    }
  };

  const handleFeedbackSubmit = () => {
    if (feedback.trim()) {
      actions.addConversationFeedback(feedback);
    }
    handleComplete();
  };

  const handleSkipFeedback = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setRating(0);
    setFeedback('');
    setStep(1);
    onComplete();
  };

  const handleClose = () => {
    setRating(0);
    setFeedback('');
    setStep(1);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      <DialogTitle
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }}
>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <img src={feedbackImage} alt="feedback" style={{ width: 24, height: 24 }} />
    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
      {step === 1 ? 'Rate Your Experience' : 'Share Your Feedback'}
    </Typography>
  </Box>

  <IconButton onClick={handleClose} size="small">
    <CloseIcon />
  </IconButton>
</DialogTitle>

      <DialogContent>
        {step === 1 ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              How would you rate your conversation with Bot AI?
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Rating
                name="conversation-rating"
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
                size="large"
                icon={<Star fontSize="inherit" />}
                emptyIcon={<StarBorder fontSize="inherit" />}
                sx={{
                  fontSize: '3rem',
                  '& .MuiRating-iconFilled': {
                    color: '#ffc107',
                  },
                  '& .MuiRating-iconEmpty': {
                    color: '#e0e0e0',
                  },
                }}
              />
            </Box>

            <Typography variant="body2" color="text.secondary">
              {rating === 0 && 'Please select a rating'}
              {rating === 1 && 'Poor - Not helpful at all'}
              {rating === 2 && 'Fair - Somewhat helpful'}
              {rating === 3 && 'Good - Moderately helpful'}
              {rating === 4 && 'Very Good - Quite helpful'}
              {rating === 5 && 'Excellent - Extremely helpful'}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ py: 2 }}>
            <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
              Thank you for rating! Would you like to share any additional feedback about your experience?
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts about the conversation, what worked well, or what could be improved..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              This feedback helps us improve Bot AI for everyone.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        {step === 1 ? (
          <>
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={handleRatingSubmit}
              variant="contained"
              disabled={rating === 0}
              sx={{
                background: 'linear-gradient(45deg, #9c88ff, #6c5ce7)',
                borderRadius: 2,
              }}
            >
              Continue
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleSkipFeedback} color="inherit">
              Skip
            </Button>
            <Button
              onClick={handleFeedbackSubmit}
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #9c88ff, #6c5ce7)',
                borderRadius: 2,
              }}
            >
              {feedback.trim() ? 'Submit Feedback' : 'Finish'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConversationEndDialog;
