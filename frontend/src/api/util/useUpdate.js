import useMutation from './useMutation';

const useUpdate = (url) => {
  const { data, loading, error, mutate: update } = useMutation(
    (item) => ({ path: `${url}/${item.id}`, body: item }),
    { method: 'PUT' },
  );

  return { data, loading, error, update };
};

export default useUpdate;