import { useState, useEffect } from 'react';
import { getClientData, getCachedClient } from '../services/api';

/**
 * useClientData — fetches Zoho CRM data for the logged-in WP user.
 * Returns { client, loading, error, refetch }
 */
export function useClientData({ preferCachedData = true } = {}) {
  const [client,  setClient]  = useState(() => (preferCachedData ? getCachedClient() : null));
  const [loading, setLoading] = useState(preferCachedData ? !getCachedClient() : true);
  const [error,   setError]   = useState(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getClientData();
      if (res.success) {
        setClient(res.data);
      } else {
        setError(res.message || 'Could not load client data.');
      }
    } catch (e) {
      setError(e.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { client, loading, error, refetch: fetch };
}
