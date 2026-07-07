import useMutation from './useMutation';

const useDelete = (url) => {
  const { loading, error, mutate: remove } = useMutation(
    (id) => ({ path: `${url}/${id}` }),
    { method: 'DELETE', json: false },
  );

  return { loading, error, remove };
};

export default useDelete;