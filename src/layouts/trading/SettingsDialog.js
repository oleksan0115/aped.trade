import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { experimentalStyled as styled, withStyles, useTheme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

import { Divider, Button, Stack, Tabs, Tab } from '@material-ui/core';

// hooks
import useSettings from '../../hooks/useSettings';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const TabContainer = styled(Tabs)(({ theme }) => ({
  minHeight: 24,
  borderRadius: '10px',
  '& .MuiTabs-indicator': { display: 'none' },
  '& .MuiButtonBase-root:not(:last-child)': { marginRight: 0 },
  '& .MuiTabs-flexContainer': {
    justifyContent: 'space-between',
    padding: 2,
    borderRadius: '10px',
    backgroundColor: '#0E0D14',
    width: '180px',
    [theme.breakpoints.up('md')]: {
      width: '164px'
    },
    '& .MuiButtonBase-root': {
      fontWeight: 300,
      minHeight: 24,
      padding: theme.spacing(0, 1.7),
      borderRadius: 15
    }
  }
}));

const TabStyles = styled(Tab)(() => ({
  '&.Mui-selected': {
    backgroundColor: '#5600C3'
  }
}));

SettingsDialog.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default function SettingsDialog({ isOpen, onClose }) {
  const theme = useTheme();

  const { stopLossMode, onChangeStopLossMode } = useSettings();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Settings
        </DialogTitle>
        <Divider />
        <DialogContent dividers sx={{ my: 3, minWidth: 340, [theme.breakpoints.up('md')]: { minWidth: 500 } }}>
          <Stack spacing={2}>
            <Button
              sx={{ backgroundColor: '#0E0D14', boxShadow: 'none', '&:hover': { backgroundColor: '#0E0D20' } }}
              fullWidth
              variant="contained"
              size="large"
            >
              <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
                <Typography>Change Theme</Typography>
                <Typography>Dark {`>`} </Typography>
              </Stack>
            </Button>
            <Button
              sx={{ backgroundColor: '#0E0D14', boxShadow: 'none', '&:hover': { backgroundColor: '#0E0D20' } }}
              fullWidth
              variant="contained"
              size="large"
            >
              <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
                <Typography>Gas Preference</Typography>
                <Typography>Fast {`>`} </Typography>
              </Stack>
            </Button>
            <Typography variant="body1">Trading Panel Side</Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="outlined">Left</Button>
              <Button variant="outlined">Right</Button>
            </Stack>
            <Typography variant="body1">Trading Panel Options</Typography>
            <Stack direction="row" spacing={2} justifyContent="space-around" alignItems="center">
              <Typography variant="caption">Stop Loss Mode</Typography>
              <TabContainer value={stopLossMode} onChange={onChangeStopLossMode} aria-label="basic tabs example">
                <TabStyles label="USD" />
                <TabStyles label="Percentage" />
              </TabContainer>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  );
}
