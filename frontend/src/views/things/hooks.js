import { useState, useEffect } from "react";
const THING_VIEW_URL = "/api/thingView/";


export const useThingView = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (filters) => {
    const url = new URL(THING_VIEW_URL, window.location.origin);
    if (filters) {
      Object.keys(filters).forEach(key => url.searchParams.append(key, filters[key]));
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return { data, loading, error, refetch: fetchData };
}
