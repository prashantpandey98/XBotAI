import React from "react";
import { Grid, Paper, Typography } from "@mui/material";

const prompts = [
  "Hi, what is the weather",
  "Hi, what is my location",
  "Hi, what is the temperature",
  "Hi, how are you"
];

export default function ChatPromptCards({ onSelect }) {
  return (
    <Grid container spacing={2} my={2}>
      {prompts.map((text, index) => (
        <Grid item xs={12} sm={6} key={index}>
          <Paper
            elevation={3}
            sx={{ p: 2, cursor: "pointer" }}
            onClick={() => onSelect(text)}
          >
            <Typography fontWeight="bold">{text}</Typography>
            <Typography variant="body2" color="text.secondary">
              Get immediate AI generated response
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}