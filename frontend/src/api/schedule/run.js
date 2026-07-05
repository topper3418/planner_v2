import { useState } from "react";
import { withApiBase } from "../config";

const SCHEDULES_RUN_URL = "/api/schedules/run";

const useRunSchedules = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(withApiBase(SCHEDULES_RUN_URL), {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error(`HTTP error on run! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, run };
};

export default useRunSchedules;