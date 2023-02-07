import React, { useState } from 'react';
import { experimentalStyled as styled } from '@material-ui/core/styles';
// material
import { Container, Button, Stack, Typography } from '@material-ui/core';

// components
import Page from '../components/Page';

import { InvestorContactForm, ContributorContactForm } from '../components/_external-pages/contact';

// ----------------------------------------------------------------------

const RootStyle = styled(Container)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2)
}));

export default function ContactUs() {
  const [contactType, setContactType] = useState('contributor');

  return (
    <Page title="Contact Us | APED">
      <RootStyle maxWidth="xl">
        <Typography variant="h2" sx={{ textAlign: 'center' }}>
          CONTACT US
        </Typography>
        {contactType === '' && (
          <Stack direction={{ sm: 'column', md: 'row' }} justifyContent="center" alignItems="center">
            <Button onClick={() => setContactType('investor')}>INVESTOR</Button>
            <Button onClick={() => setContactType('contributor')}>CONTRIBUTOR</Button>
          </Stack>
        )}

        {contactType === 'investor' && <InvestorContactForm />}
        {contactType === 'contributor' && <ContributorContactForm />}
      </RootStyle>
    </Page>
  );
}
