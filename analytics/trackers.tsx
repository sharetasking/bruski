"use client"

import Hotjar from '@hotjar/browser';
import { useEffect } from 'react';
import { GoogleAnalytics } from "nextjs-google-analytics";


const siteId = 3837404;
const hotjarVersion = 6;



const Trackers: React.FC = () => {

  useEffect(() => {
    Hotjar.init(siteId, hotjarVersion);
  });
  
  return (<>
  <GoogleAnalytics trackPageViews gaMeasurementId="G-71ME0MPZPE" />
  </>)
}
 

export default Trackers;