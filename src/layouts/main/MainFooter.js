import { Link as RouterLink } from 'react-router-dom';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Link, Container, Stack } from '@material-ui/core';
//
import Image from '../../components/Image';

// ----------------------------------------------------------------------

const LINKS = [
  { name: 'TERMS OF USE', href: '#' },
  { name: 'REFERAL TERMS', href: '#' },
  { name: 'DOCS', href: '#' },
  { name: 'PRIVACY POLICY', href: '#' }
];

const SOCIALS = [
  { name: 'medium', icon: '/static/socials/social-medium.png', href: '#' },
  { name: 'discord', icon: '/static/socials/social-discord.png', href: '#' },
  { name: 'twitter', icon: '/static/socials/social-twitter.png', href: '#' }
];

const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  paddingTop: theme.spacing(5),
  borderTop: '2px solid #202020',
  borderBottom: '2px solid #202020',
  backgroundColor: '#13121D'
}));

// ----------------------------------------------------------------------

export default function MainFooter() {
  return (
    <RootStyle>
      <Container maxWidth="sm">
        <Stack spacing={5} alignItems="center" sx={{ marginBottom: 3 }}>
          <Image src="/static/landing/footer-logo.png" sx={{ margin: 'auto' }} />
          <Stack direction="row" spacing={2}>
            {SOCIALS.map((link) => (
              <Image key={link.name} src={link.icon} sx={{ margin: 'auto' }} />
            ))}
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, md: 5 }}>
            {LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                color="common.white"
                variant="body2"
                component={RouterLink}
                sx={{ display: 'block', textAlign: 'center' }}
              >
                {link.name}
              </Link>
            ))}
          </Stack>
        </Stack>
      </Container>
    </RootStyle>
  );
}
