import { useState } from "react";

const useFetchState = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reset = () => {
    setData(null);
    setLoading(true);
    setError(null);
  };

  return { data, setData, loading, setLoading, error, setError, reset };
};

export default useFetchState;
