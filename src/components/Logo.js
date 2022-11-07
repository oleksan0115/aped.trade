import PropTypes from 'prop-types';
// material
import { useTheme } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object
};

export default function Logo({ sx }) {
  const theme = useTheme();
  return (
    <Box
      component="img"
      src="/static/brand/logo.png"
      sx={{
        height: 40,
        width: 138,
        margin: 0,
        ...sx,
        [theme.breakpoints.up('md')]: { height: 56, width: 194, margin: 2 }
      }}
    />
  );
}
