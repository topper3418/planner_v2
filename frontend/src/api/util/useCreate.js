import useMutation from './useMutation';

const useCreate = (url) => {
  const { data, loading, error, mutate: create } = useMutation(
    (body) => ({ path: url, body }),
    { method: 'POST' },
  );

  return { data, loading, error, create };
};

export default useCreate;