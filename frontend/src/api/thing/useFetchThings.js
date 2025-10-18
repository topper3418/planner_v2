import { useEffect } from "react";
import useFetchState from "../../util/useFetchState";

const THINGS_URL = "/api/things/";

const useFetchThings = ({ parent_id, include } = {}) => {
  const { data, setData, loading, setLoading, error, setError, reset } =
    useFetchState(null);

  const fetchData = async ({ parent_id, include } = {}) => {
    // reset state
    reset();
    // build url
    const url = new URL(THINGS_URL, window.location.origin);
    // set the parent_id param if provided
    if (parent_id !== undefined) {
      url.searchParams.append("parent_id", parent_id);
    }

    // set the include param if provided
    // include can be a string or an array of strings
    if (include) {
      if (Array.isArray(include)) {
        include.forEach((inc) => url.searchParams.append("include", inc));
      } else {
        url.searchParams.append("include", include);
      }
    }

    // fetch data, manage state
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `HTTP error on fetch tree view! status: ${response.status}`,
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
    fetchData({ parent_id, include });
  }, []);

  return { data, loading, error, refetch: fetchData };
};

export default useFetchThings;
