import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import React from 'react';

// materials
import { useTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import Image from './Image';

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
            height: 520,
            [theme.breakpoints.up('md')]: { width: 500 }
          }
        }}
      >
        <DialogContent sx={{ overflowY: 'hidden' }}>
          <Image src="/static/landing/astronaut.png" sx={{ width: 120, height: 120, margin: 'auto' }} />
          <Typography variant="h4" sx={{ textAlign: 'center', my: 2 }}>
            Join limited Presale Waitlist
          </Typography>
          <div className="launchlist-widget" data-key-id="31PxJ8" data-height="250px" />
          <Helmet>
            <script src="https://getlaunchlist.com/js/widget.js" type="text/javascript" defer />
          </Helmet>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="secondary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
