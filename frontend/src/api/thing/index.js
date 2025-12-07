import useCreateThing from "./create";
import useFetchThing from "./fetchOne";
import useFetchThingTree from "./fetchTree";
import useFetchThings from "./fetchMany";
import useFetchThingCategories from "./fetchCategories";
import useUpdateThing from "./update";
import useCreateThingCategory from "./createCategory";
import useUpdateThingCategory from "./updateCategory";

const thingApi = {
  create: useCreateThing,
  fetchOne: useFetchThing,
  fetchTree: useFetchThingTree,
  fetchMany: useFetchThings,
  update: useUpdateThing,
  fetchCategories: useFetchThingCategories,
  createCategory: useCreateThingCategory,
  updateCategory: useUpdateThingCategory,
};

export default thingApi;
