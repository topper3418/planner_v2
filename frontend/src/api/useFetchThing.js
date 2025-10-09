import { useState } from "react";

const THING_GET_URL = "/api/things";

const useFetchThing = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getThing = async (thingId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(THING_GET_URL + "/" + thingId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error on get thing! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Fetched thing:", result);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, getThing };
};

export default useFetchThing;
