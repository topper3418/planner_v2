import { useState } from 'react';


const THING_UPDATE_URL = '/api/things';


const useUpdateThing = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateThing = async (thing) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(THING_UPDATE_URL + '/' + thing.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(thing),
      });
      if (!response.ok) {
        throw new Error(`HTTP error on create thing! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('Updated thing:', result);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { data, loading, error, updateThing };
}


export default useUpdateThing;

