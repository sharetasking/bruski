"use client"

import Hotjar from '@hotjar/browser';
import { useEffect } from 'react';
import Analytics from 'analytics'
// import googleAnalytics from '@analytics/google-analytics'
import useBruskiUser from '@/hooks/useBruskiUser';

const siteId = 3837404;
const hotjarVersion = 6;


// const analytics = Analytics({
//   app: 'bruski',
//   plugins: [
//     googleAnalytics({
//       measurementIds: ['G-71ME0MPZPE']
//     })
//   ]
// })


const Trackers = () => {

  const {data:user} = useBruskiUser();
  useEffect(() => {
    Hotjar.init(siteId, hotjarVersion);

    // if(user) {
    //   analytics.identify(user.id, {
    //     name: user.name,
    //     email: user.email
    //   })
    // }




    /* Track a Google Analytics page view */
    // analytics.page()

  });
  
  return null;
}
 

export default Trackers;