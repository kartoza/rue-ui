import type { Metric } from 'web-vitals';

type ReportWebVitalsCallback = (metric: Metric) => void;

const reportWebVitals = (onPerfEntry?: ReportWebVitalsCallback) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals').then((webVitals) => {
      webVitals.onCLS(onPerfEntry);
      webVitals.onFCP(onPerfEntry);
      webVitals.onLCP(onPerfEntry);
      webVitals.onTTFB(onPerfEntry);
      if (webVitals.onINP) {
        webVitals.onINP(onPerfEntry);
      }
    });
  }
};

export default reportWebVitals;
