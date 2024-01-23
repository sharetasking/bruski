"use client"

import Hotjar from '@hotjar/browser';
import { useEffect } from 'react';

const siteId = 3837404;
const hotjarVersion = 6;

const Trackers = () => {

  useEffect(() => {
    Hotjar.init(siteId, hotjarVersion);
  });
  
  return null;
}
 

export default Trackers;