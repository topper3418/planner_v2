import { useEffect } from 'react';

import useMutation from './useMutation';

const useFetchOne = (url, itemId = undefined, { lazy = false } = {}) => {
  const { data, loading, error, mutate: fetchOne } = useMutation(
    (id) => ({ path: `${url}/${id}` }),
    { method: 'GET' },
  );

  useEffect(() => {
    if (itemId && !lazy) {
      fetchOne(itemId);
    }
  }, []);

  return { data, loading, error, fetchOne };
};

export default useFetchOne;