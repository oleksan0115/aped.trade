// ----------------------------------------------------------------------

export default function Paper() {
  return {
    MuiPaper: {
      defaultProps: {
        elevation: 0
      },

      styleOverrides: {
        root: {
          background: '#232133',
          backgroundImage: 'none'
        }
      }
    }
  };
}
