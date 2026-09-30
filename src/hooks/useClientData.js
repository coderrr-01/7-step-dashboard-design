import { useState, useEffect, useCallback, useRef } from 'react';
import { getClientData, getCachedClient } from '../services/api';

/**
 * useClientData — fetches Zoho CRM data for the logged-in WP user.
 * Returns { client, loading, refreshing, fetched, error, refetch }
 *
 * loading   → true only while there is nothing at all to render (no cache yet).
 *             Once a payload exists, later fetches run in the background and
 *             never flip loading back on, so a refresh can't blank the screen.
 * refreshing→ true while a background refresh is in flight.
 * fetched   → true once the first network fetch has settled. This is the signal
 *             callers must use before treating `client` as authoritative —
 *             before that it may only be the localStorage snapshot.
 */
export function useClientData({ preferCachedData = true } = {}) {
  const [client,  setClient]  = useState(() => (preferCachedData ? getCachedClient() : null));
  const [loading, setLoading] = useState(preferCachedData ? !getCachedClient() : true);
  const [refreshing, setRefreshing] = useState(false);
  const [fetched,   setFetched]   = useState(false);
  const [error,   setError]   = useState(null);

  // Tracks "do we already have something to render?" across renders without
  // re-reading localStorage on every pass.
  const hasDataRef = useRef(null);
  if (hasDataRef.current === null) {
    hasDataRef.current = preferCachedData ? !!getCachedClient() : false;
  }

  const fetch = useCallback(async () => {
    // Only block when there is nothing to show; otherwise refresh silently.
    if (hasDataRef.current) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await getClientData();
      if (res.success) {
        hasDataRef.current = true;
        setClient(res.data);
      } else {
        setError(res.message || 'Could not load client data.');
      }
    } catch (e) {
      setError(e.message || 'Network error.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setFetched(true);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { client, loading, refreshing, fetched, error, refetch: fetch };
}
