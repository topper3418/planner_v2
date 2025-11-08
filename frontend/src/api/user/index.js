import useCreateUser from "./create";
import useFetchUsers from "./fetchMany";
import useUpdateUser from "./update";

const userApi = {
  create: useCreateUser,
  fetchMany: useFetchUsers,
  update: useUpdateUser,
};

export default userApi;
