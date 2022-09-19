import PropTypes from 'prop-types';
import React from 'react';

// materials
import { useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

JoinWaitlistDialog.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default function JoinWaitlistDialog({ isOpen, onClose }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          '& .MuiPaper-root': {
            width: 400,
            height: 'calc(100% - 200px)',
            [theme.breakpoints.up('md')]: { width: 600, height: 650 }
          }
        }}
      >
        <DialogContent>
          <div>
            <iframe
              title="waitlist"
              scrolling="no"
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                border: '0',
                width: '100%',
                height: '100%'
              }}
              src="https://getwaitlist.com/waitlist/4158"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" size="large" color="secondary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
