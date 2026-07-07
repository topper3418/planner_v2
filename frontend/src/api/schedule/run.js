import useMutation from '../util/useMutation';

const SCHEDULES_RUN_URL = '/api/schedules/run';

const useRunSchedules = () => {
  const { data, loading, error, mutate: run } = useMutation(
    () => ({ path: SCHEDULES_RUN_URL }),
    { method: 'POST', errorPrefix: 'HTTP error on run' },
  );

  return { data, loading, error, run };
};

export default useRunSchedules;