import { capitalCase } from 'change-case';

import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';

import { Paper, List, ListItem, Typography, Box, Stack } from '@material-ui/core';

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

TradesDetailDialog.propTypes = {
  dialogContent: PropTypes.object,
  onShowDialog: PropTypes.func,
  showDialog: PropTypes.bool
};

export default function TradesDetailDialog({ dialogContent, showDialog, onShowDialog }) {
  const [open, setOpen] = React.useState(showDialog);

  React.useEffect(() => {
    setOpen(showDialog);
  }, [showDialog]);

  const handleClose = () => {
    onShowDialog(false);
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        keepMounted
        open={open}
        sx={{ '& .MuiPaper-root': { width: '100%' } }}
      >
        <DialogContent dividers>
          <Box m={2} />
          <Paper sx={{ p: 1 }}>
            <List>
              {Object.keys(dialogContent).map((key, index) => (
                <ListItem
                  key={index}
                  sx={{ justifyContent: 'space-between !important', borderBottom: '1px solid #ffffff1a' }}
                >
                  <Typography variant="body2">{capitalCase(key)}</Typography>
                  {key === 'pair' ? (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        component="img"
                        src={dialogContent[key].icon}
                        sx={{ width: 25, height: 25, borderRadius: '50%' }}
                      />
                      <Box
                        component="img"
                        src={`/static/icons/trading_ui/two_${dialogContent[key].direction}_arrow.svg`}
                        sx={{ width: 12, margin: '0 5px' }}
                      />
                    </Stack>
                  ) : (
                    <Typography variant="body2" sx={{ ...(key === 'roi' && { color: '#72F238' }) }}>
                      {key === 'leverage' ? `x${dialogContent[key]}` : dialogContent[key]}
                    </Typography>
                  )}
                </ListItem>
              ))}
            </List>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
