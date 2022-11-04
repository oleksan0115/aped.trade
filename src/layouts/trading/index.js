import { Outlet } from 'react-router-dom';
//
import TradingNavbar from './TradingNavbar';
import TradingFooter from './TradingFooter';

// ----------------------------------------------------------------------

export default function MainLayout() {
  return (
    <>
      <TradingNavbar />
      <div>
        <Outlet />
      </div>
      <TradingFooter />
    </>
  );
}
