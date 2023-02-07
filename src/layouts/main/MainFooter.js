import { Link as ScrollLink } from 'react-scroll';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Link, Container, Stack } from '@material-ui/core';
//
import Image from '../../components/Image';

// paths
import { PATH_PAGE } from '../../routes/paths';

// ----------------------------------------------------------------------

const LINKS = [
  { name: 'DOCS', href: 'https://aped-xyz.gitbook.io/litepaper' },
  { name: 'CONTACT US', href: PATH_PAGE.contactUs }
];

const SOCIALS = [
  { name: 'medium', icon: '/static/socials/social-medium.png', href: 'https://medium.com/@aped.xyz' },
  { name: 'discord', icon: '/static/socials/social-discord.png', href: 'https://discord.gg/EsefFWM7Dd' },
  { name: 'twitter', icon: '/static/socials/social-twitter.png', href: 'https://twitter.com/aped_xyz' }
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
          <ScrollLink to="move_top">
            <Image src="/static/landing/footer-logo.png" sx={{ margin: 'auto', '&:hover': { cursor: 'pointer' } }} />
          </ScrollLink>
          <Stack direction="row" spacing={2}>
            {SOCIALS.map((link) => (
              <Link href={link.href} key={link.name}>
                <Image src={link.icon} sx={{ margin: 'auto' }} />
              </Link>
            ))}
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, md: 5 }}>
            {LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                color="common.white"
                variant="body2"
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
