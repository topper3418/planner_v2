import useCreateAction from "./create";
import useCreateActionType from "./createActionType";
import useFetchActions from "./fetchMany";
import useFetchActionType from "./fetchType";
import useFetchActionTypes from "./fetchTypes";
import useUpdateActionType from "./updateActionType";

const actionApi = {
  create: useCreateAction,
  fetchMany: useFetchActions,
  fetchTypes: useFetchActionTypes,
  fetchType: useFetchActionType,
  createType: useCreateActionType,
  updateType: useUpdateActionType,
};

export default actionApi;
