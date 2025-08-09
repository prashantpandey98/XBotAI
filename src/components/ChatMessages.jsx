import React from "react";
import { Box, Typography } from "@mui/material";

export default function ChatMessages({ chat }) {
  return (
    <Box sx={{ minHeight: "200px", my: 2 }}>
      {chat.map((entry, index) => (
        <Typography key={index} sx={{ my: 1 }}>
          <strong>{entry.user}:</strong> {entry.message}
        </Typography>
      ))}
    </Box>
  );
}