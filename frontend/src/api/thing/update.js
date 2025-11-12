import apiUtils from "../util";

const { useUpdate } = apiUtils;

const THING_UPDATE_URL = "/api/things";

const useUpdateThing = () => {
  const { data, loading, error, update } = useUpdate(THING_UPDATE_URL);
  return { data, loading, error, update };
};

export default useUpdateThing;
