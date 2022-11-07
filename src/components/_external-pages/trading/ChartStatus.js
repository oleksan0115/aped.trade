import PropTypes from 'prop-types';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';

ChartStatus.propTypes = {
  isLight: PropTypes.bool
};

function ChartStatus({ isLight }) {
  return <TradingViewWidget symbol="NASDAQ:AAPL" theme={isLight ? Themes.LIGHT : Themes.DARK} locale="fr" autosize />;
}

export default Chart;
