import apiUtils from "../util";

const { useCreate } = apiUtils;

const THING_CATEGORY_CREATE_URL = "/api/things/categories/";

const useCreateThingCategory = () => {
  const { data, loading, error, create } = useCreate(THING_CATEGORY_CREATE_URL);
  return { data, loading, error, create };
};

export default useCreateThingCategory;
