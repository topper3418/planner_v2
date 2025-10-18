import { useEffect } from "react";
import useFetchState from "../../util/useFetchState";

const THING_CATEGORIES_URL = "/api/things/categories/";

const useFetchThingCategories = () => {
  const { data, setData, loading, setLoading, error, setError, reset } =
    useFetchState(null);

  const fetchData = async () => {
    // reset state
    reset();
    // build url
    const url = new URL(THING_CATEGORIES_URL, window.location.origin);
    // fetch data, manage state
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `HTTP error on fetch thing categories! status: ${response.status}`,
        );
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
};

export default useFetchThingCategories;
