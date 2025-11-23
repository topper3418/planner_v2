import apiUtils from "../util";

const { useFetch } = apiUtils;

const ACTIONS_URL = "/api/actions/";

const useFetchActions = (
  {
    ticket_id,
    include,
    action_type_id,
    action_name_id,
    performed_before,
    performed_after,
  } = {},
  { lazy = false } = {},
) => {
  const urlBuilder = (url, params) => {
    const {
      ticket_id,
      include,
      action_type_id,
      action_name_id,
      performed_before,
      performed_after,
    } = params;
    if (ticket_id !== undefined) {
      url.searchParams.append("ticket_id", ticket_id);
    }
    if (action_type_id !== undefined) {
      url.searchParams.append("action_type_id", action_type_id);
    }
    if (action_name_id !== undefined) {
      url.searchParams.append("action_name_id", action_name_id);
    }
    if (performed_before !== undefined) {
      url.searchParams.append("performed_before", performed_before);
    }
    if (performed_after !== undefined) {
      url.searchParams.append("performed_after", performed_after);
    }

    // set the include param if provided
    // include can be a string or an array of strings
    if (include) {
      if (Array.isArray(include)) {
        include.forEach((inc) => url.searchParams.append("include", inc));
      } else {
        url.searchParams.append("include", include);
      }
    }
    return url;
  };

  const { data, loading, error, fetchData } = useFetch(
    ACTIONS_URL,
    urlBuilder,
    {
      ticket_id,
      include,
      action_type_id,
      action_name_id,
      performed_before,
      performed_after,
    },
    { lazy },
  );

  return { data, loading, error, refetch: fetchData };
};

export default useFetchActions;
