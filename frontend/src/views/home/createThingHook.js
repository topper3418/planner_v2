import { useState } from 'react';


const THING_CREATE_URL = '/api/things';


const useCreateThing = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createThing = async (name) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(THING_CREATE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error on create thing! status: ${response.status}`);
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
  return { data, loading, error, createThing };
}


export default useCreateThing;
