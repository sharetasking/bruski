import mixpanel from 'mixpanel-browser';

mixpanel.init("fc29e7f9b8c2a11ef119d200c28475b8", { debug: true, track_pageview: true, persistence: 'localStorage',ignore_dnt: true });

export const trackEvent = (event, props) => {
  if (process.env.NODE_ENV === 'production') {
    mixpanel.track(event, props);
  } else {
    console.log('Event Tracked:', event, props);
  }
};

export default mixpanel;