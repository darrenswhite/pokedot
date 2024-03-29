import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import React from 'react';

export interface TeamValidationDialogProps {
  open: boolean;
  onClose: () => void;
  problems: string[] | null;
}

export const TeamValidationDialog: React.FC<TeamValidationDialogProps> = ({
  open,
  onClose,
  problems,
}: TeamValidationDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Team Validation</DialogTitle>

      <DialogContent>
        {problems && problems.length > 0 && (
          <>
            <DialogContentText>
              Your team was rejected for the following reasons:
            </DialogContentText>

            <ul>
              {problems.map((problem, index) => (
                <li key={index}>
                  <Typography variant="body1">{problem}</Typography>
                </li>
              ))}
            </ul>
          </>
        )}

        {(!problems || problems.length === 0) && (
          <DialogContentText>Your team is valid.</DialogContentText>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};
