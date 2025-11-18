import apiUtils from "../util";

const { useCreate } = apiUtils;

const THING_CREATE_URL = "/api/things/";

const useCreateThing = () => {
  const { data, loading, error, create } = useCreate(THING_CREATE_URL);
  return { data, loading, error, create };
};

export default useCreateThing;
