import useCreateThing from "./useCreateThing";
import useFetchThing from "./useFetchThing";
import useFetchThingTree from "./useFetchThingTree";
import useFetchThings from "./useFetchThings";
import useFetchThingCategories from "./useFetchThingCategories";
import useUpdateThing from "./useUpdateThing";

const thingApi = {
  create: useCreateThing,
  fetchOne: useFetchThing,
  fetchTree: useFetchThingTree,
  fetchMany: useFetchThings,
  update: useUpdateThing,
  fetchCategories: useFetchThingCategories,
};

export default thingApi;
