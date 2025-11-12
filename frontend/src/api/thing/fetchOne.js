import apiUtils from "../util";

const { useFetchOne } = apiUtils;

// url
const THING_GET_URL = "/api/things";

const useFetchThing = (thingId = undefined) => {
  const { data, loading, error, fetchOne } = useFetchOne(
    THING_GET_URL,
    thingId,
  );

  // return state and the fetch function
  return { data, loading, error, fetchOne };
};

export default useFetchThing;
