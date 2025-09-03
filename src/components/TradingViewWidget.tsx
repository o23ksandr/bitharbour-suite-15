import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
declare global {
  interface Window {
    TradingView: any;
  }
}
type Props = {
  symbol?: string;
  interval?: string; // default 'D'
  height?: number;
  showControls?: boolean;
};
export default function TradingViewWidget({
  symbol = 'BINANCE:BTCUSDT',
  interval = 'D',
  height = 420,
  showControls = true
}: Props) {
  const containerId = useId().replace(/[:]/g, '');
  const ref = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const [tf, setTf] = useState(interval);

  // Initialize widget once per symbol
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const init = () => {
      if (!window.TradingView) return;
      // eslint-disable-next-line new-cap
      const widget = new window.TradingView.widget({
        symbol,
        interval: tf,
        timezone: 'Etc/UTC',
        theme: 'light',
        style: '1',
        locale: 'en',
        withdateranges: false,
        allow_symbol_change: false,
        hide_top_toolbar: false,
        hide_side_toolbar: true,
        hide_legend: true,
        hide_bottom_toolbar: true,
        enable_publishing: false,
        fullscreen: true,
        autosize: true,
        container_id: containerId,
        disabled_features: ['timeframes_toolbar', 'volume_force_overlay', 'create_volume_indicator_by_default', 'compare_symbol', 'symbol_search_hot_key', 'header_compare', 'compare_symbol_search_spread_operators'],
        overrides: {
          'mainSeriesProperties.candleStyle.upColor': '#ffffff',
          'mainSeriesProperties.candleStyle.downColor': '#000000',
          'mainSeriesProperties.candleStyle.borderUpColor': '#000000',
          'mainSeriesProperties.candleStyle.borderDownColor': '#000000',
          'mainSeriesProperties.candleStyle.wickUpColor': '#000000',
          'mainSeriesProperties.candleStyle.wickDownColor': '#000000'
        }
      });
      widgetRef.current = widget;

      // Auto fit data to screen when ready (like the screenshot)
      try {
        widget.onChartReady(() => {
          const chart = widget.activeChart?.() ?? widget.chart?.();
          chart?.executeActionById?.('chartFitContent');
          try {
            const studies = chart?.getAllStudies?.() || [];
            studies.forEach((s: any) => {
              const name = (s?.name || s?.studyName || '').toString().toLowerCase();
              if (name.includes('volume')) {
                chart?.removeEntity?.(s.id);
              }
            });
          } catch {}
        });
      } catch {}
    };
    if (window.TradingView) {
      init();
    } else {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = init;
      document.body.appendChild(script);
      return () => {
        try {
          document.body.removeChild(script);
        } catch {}
      };
    }
  }, [symbol, containerId]);

  // Change timeframe without re-creating the widget
  useEffect(() => {
    const widget = widgetRef.current;
    if (!widget) return;
    try {
      widget.onChartReady(() => {
        const chart = widget.activeChart?.() ?? widget.chart?.();
        chart?.setResolution?.(tf, () => {});
      });
    } catch {}
  }, [tf]);
  const timeframes: {
    label: string;
    value: string;
  }[] = [{
    label: '1M',
    value: 'M'
  }, {
    label: '1W',
    value: 'W'
  }, {
    label: '1D',
    value: 'D'
  }, {
    label: '1H',
    value: '60'
  }];
  return <div className="w-full">
      {showControls}
      <div id={containerId} ref={ref} className="w-full [&>iframe]:border-0" style={{
      height
    }} />
    </div>;
}