import apiUtils from "../util";

const { useCreate } = apiUtils;

const COMMENT_CREATE_URL = "/api/comments/";

const useCreateComment = () => {
  const { data, loading, error, create } = useCreate(COMMENT_CREATE_URL);
  return { data, loading, error, create };
};

export default useCreateComment;
