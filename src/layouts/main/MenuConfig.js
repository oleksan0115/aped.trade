import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const menuConfig = [
  {
    title: 'TRADABLE ASSETS',
    path: '/',
    icon: <Iconify icon="carbon:home" sx={{ width: 20, height: 20 }} />
  },
  {
    title: 'FAQ',
    path: '/faq',
    icon: <Iconify icon="material-symbols:generating-tokens-outline-rounded" sx={{ width: 20, height: 20 }} />
  },
  {
    title: 'WHITE PAPER',
    path: 'https://aped-xyz.gitbook.io/copy-of-aped.-xyz-perp-dex-litepaper/intro',
    icon: <Iconify icon="fluent:text-font-info-16-filled" sx={{ width: 20, height: 20 }} />
  }
];

export default menuConfig;
