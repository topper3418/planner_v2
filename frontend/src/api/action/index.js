import useCreateAction from "./create";
import useFetchActions from "./fetchMany";
import useFetchActionType from "./fetchType";
import useFetchActionTypes from "./fetchTypes";

const actionApi = {
  create: useCreateAction,
  fetchMany: useFetchActions,
  fetchTypes: useFetchActionTypes,
  fetchType: useFetchActionType,
};

export default actionApi;
