/* eslint-disable */
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
// components
// import Settings from './components/settings';
import RtlLayout from './components/RtlLayout';
import ScrollToTop from './components/ScrollToTop';
import NotistackProvider from './components/NotistackProvider';
import ThemePrimaryColor from './components/ThemePrimaryColor';

import ThemeContextProvider from './contexts/ThemeContext';
import ContractContextProvider from './contexts/ContractContext';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ContractContextProvider>
    <ThemeContextProvider>
      <ThemeConfig>
        <ThemePrimaryColor>
          <RtlLayout>
            <NotistackProvider>
              {/* <Settings /> */}
              <ScrollToTop />
              <Router />
            </NotistackProvider>
          </RtlLayout>
        </ThemePrimaryColor>
      </ThemeConfig>
    </ThemeContextProvider>
    </ContractContextProvider>
  );
}
