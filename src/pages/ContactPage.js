import React, { useState } from 'react';
import { experimentalStyled as styled } from '@material-ui/core/styles';
// material
import { Container, Stack, Typography } from '@material-ui/core';

// components
import Page from '../components/Page';

import { InvestorContactForm, ContributorContactForm } from '../components/_external-pages/contact';

// ----------------------------------------------------------------------

const RootStyle = styled(Container)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    marginTop: theme.spacing(10)
  }
}));

export default function ContactUs() {
  const [contactType, setContactType] = useState('');

  return (
    <Page title="Contact Us | APED">
      <RootStyle maxWidth="xl">
        <Typography variant="h2" sx={{ textAlign: 'center' }}>
          CONTACT US
        </Typography>
        {contactType === '' && (
          <Stack
            className="contact-buttons"
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-around"
            alignItems="center"
          >
            <a className="blue-btn" href="#" onClick={() => setContactType('investor')}>
              INVESTOR
            </a>
            <a className="pink-btn" href="#" onClick={() => setContactType('contributor')}>
              CONTRIBUTOR
            </a>
          </Stack>
        )}

        {contactType === 'investor' && <InvestorContactForm onBackToMain={() => setContactType('')} />}
        {contactType === 'contributor' && <ContributorContactForm onBackToMain={() => setContactType('')} />}
      </RootStyle>
    </Page>
  );
}
