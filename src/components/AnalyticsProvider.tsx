import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSiteConfig } from '@/hooks/useSiteConfig';

type ConsentStatus = 'granted' | 'denied' | 'unknown';

function getConsent(): ConsentStatus {
  if (typeof window === 'undefined') return 'unknown';
  const raw = window.localStorage.getItem('analytics_consent');
  if (raw === 'granted' || raw === 'denied') return raw;
  return 'unknown';
}

function setConsent(status: ConsentStatus) {
  if (typeof window === 'undefined') return;
  if (status === 'unknown') {
    window.localStorage.removeItem('analytics_consent');
  } else {
    window.localStorage.setItem('analytics_consent', status);
  }
}

function loadGa(measurementId: string) {
  if (typeof window === 'undefined') return;
  if (!measurementId) return;
  if ((window as any).gtag) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: unknown[]) {
    (window as any).dataLayer.push(args);
  }
  (window as any).gtag = gtag;
  gtag('js', new Date());
  gtag('config', measurementId, { anonymize_ip: true });
}

function loadGtm(containerId: string) {
  if (typeof window === 'undefined') return;
  if (!containerId) return;
  if (document.getElementById('gtm-script')) return;
  (window as any).dataLayer = (window as any).dataLayer || [];
  const script = document.createElement('script');
  script.id = 'gtm-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(containerId)}`;
  document.head.appendChild(script);
}

export function AnalyticsProvider() {
  const location = useLocation();
  const { config } = useSiteConfig();
  const gaId = config.analytics?.gaMeasurementId?.trim() || '';
  const gtmId = config.analytics?.gtmId?.trim() || '';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const consent = getConsent();
    if (consent === 'granted') {
      if (gaId) loadGa(gaId);
      if (gtmId) loadGtm(gtmId);
    }
  }, [gaId, gtmId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const consent = getConsent();
    if (consent !== 'granted') return;
    const ga = (window as any).gtag;
    if (!ga || !gaId) return;
    ga('event', 'page_view', {
      page_path: location.pathname + location.search,
      page_title: document.title,
    });
  }, [location, gaId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (getConsent() !== 'unknown') return;
    const timer = window.setTimeout(() => {
      const banner = document.getElementById('analytics-consent-banner');
      if (!banner) return;
      banner.style.display = 'flex';
    }, 1000);
    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const type = target.getAttribute('data-analytics-consent');
      if (type === 'accept') {
        setConsent('granted');
        const banner = document.getElementById('analytics-consent-banner');
        if (banner) banner.style.display = 'none';
        if (gaId) loadGa(gaId);
        if (gtmId) loadGtm(gtmId);
      } else if (type === 'reject') {
        setConsent('denied');
        const banner = document.getElementById('analytics-consent-banner');
        if (banner) banner.style.display = 'none';
      }
    };
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
    };
  }, [gaId, gtmId]);

  return (
    <div
      id="analytics-consent-banner"
      className="fixed inset-x-0 bottom-0 z-50 hidden md:flex items-center justify-between gap-4 bg-gray-900 text-white px-4 py-3 text-sm"
    >
      <div className="max-w-3xl">
        我们会使用 Cookie 统计站点访问数据，用于产品优化和转化分析，不会出售或滥用你的信息。你可以在「Cookie设置」页面随时调整选择。
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          data-analytics-consent="reject"
          className="px-3 py-1.5 rounded border border-gray-600 text-gray-200 hover:bg-gray-800"
        >
          仅使用必要 Cookie
        </button>
        <button
          type="button"
          data-analytics-consent="accept"
          className="px-3 py-1.5 rounded bg-brand-orange text-white hover:bg-brand-orange/90"
        >
          同意统计 Cookie
        </button>
      </div>
    </div>
  );
}
