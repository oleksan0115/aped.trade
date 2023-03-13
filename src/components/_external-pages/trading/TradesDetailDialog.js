import { capitalCase } from 'change-case';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { withStyles, experimentalStyled as styled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';

import { Paper, Typography, Box, Stack, Table, TableBody, TableCell, TableRow } from '@material-ui/core';

const CloseTradeButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#5600C3',
  boxShadow: 'none',
  fontSize: '12px',
  padding: theme.spacing(0.2, 1),
  borderRadius: '5px',
  fontWeight: 300,
  border: '0.5px solid rgba(255, 255, 255, 0.5)',
  '&:hover': {
    backgroundColor: '#420391d6'
  }
}));

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
  showDialog: PropTypes.bool,
  tab: PropTypes.number
};

export default function TradesDetailDialog({ dialogContent, tab, showDialog, onShowDialog }) {
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
            <Table size="small" aria-label="a dense table">
              <TableBody>
                {Object.keys(dialogContent).map((key, index) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ width: '50%', borderRight: '1px solid #bbbbbb !important' }}>
                      <Typography variant="body2">{capitalCase(key)}</Typography>
                    </TableCell>
                    <TableCell align="left">
                      {key === 'pair' ? (
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '50%' }}>
                          <Box
                            component="img"
                            src={dialogContent[key]?.icon}
                            sx={{ width: 25, height: 25, borderRadius: '50%' }}
                          />
                          <Box
                            component="img"
                            src={`/static/icons/trading_ui/two_${dialogContent[key]?.orderDirection}_arrow.svg`}
                            sx={{ width: 12, margin: '0 5px' }}
                          />
                        </Stack>
                      ) : (
                        <Typography variant="body2" sx={{ ...(key === 'roi' && { color: '#72F238' }) }}>
                          {key === 'leverage' ? `x${dialogContent[key]}` : dialogContent[key]}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
            <CloseTradeButton variant="contained" onClick={handleClose}>
              {tab === 0 ? 'Close Trade' : 'Close'}
            </CloseTradeButton>
          </Stack>
        </DialogActions>
      </Dialog>
    </div>
  );
}
