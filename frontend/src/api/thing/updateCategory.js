import apiUtils from "../util";

const { useUpdate } = apiUtils;

const THING_CATEGORY_UPDATE_URL = "/api/things/categories";

const useUpdateThingCategory = () => {
  const { data, loading, error, update } = useUpdate(THING_CATEGORY_UPDATE_URL);
  return { data, loading, error, update };
};

export default useUpdateThingCategory;
