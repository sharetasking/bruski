"use client"
import { useEffect } from 'react';
import ReactGA from 'react-ga';

export default function GoogleAnalytics() {
  useEffect(() => {
    ReactGA.initialize('G-71ME0MPZPE');
    ReactGA.pageview(window.location.pathname);
  }, []);

  return null;
}
