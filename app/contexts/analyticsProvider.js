'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import analytics from '@/lib/analytics'
import { v4 as uuidv4 } from 'uuid';

export default function AnalyticsProvider({ children }) {
  const pathname = usePathname()
  const visitIdRef = useRef(null);
  const visitorIdRef = useRef(null);

  useEffect(() => {
    // Get or create a unique visitor ID
    let visitorId = localStorage.getItem('uniqueID');
    
    if (!visitorId) {
      visitorId = uuidv4();
      localStorage.setItem('uniqueID', visitorId);
    }
    
    visitorIdRef.current = visitorId;

    // Only identify if we have a valid visitor ID and analytics is available
    if (analytics && visitorId) {
      analytics.identify(visitorId);
    }

    const recordPageVisit = () => {
      visitIdRef.current = uuidv4();
      
      if (analytics) {
        analytics.track('pageVisit', {
          visitId: visitIdRef.current,
          path: pathname,
          referrer: document.referrer || 'direct',
          title: document.title,
          visitTime: new Date().toISOString()
        });
      }
    };

    const recordPageLeave = () => {
      if (visitIdRef.current && analytics) {
        analytics.track('pageLeave', {
          visitId: visitIdRef.current,
          path: pathname,
          leaveTime: new Date().toISOString()
        });
        visitIdRef.current = null;
      }
    };

    recordPageVisit();

    window.addEventListener('beforeunload', recordPageLeave);

    return () => {
      window.removeEventListener('beforeunload', recordPageLeave);
      recordPageLeave();
    };
  }, [pathname]);

  return children;
}