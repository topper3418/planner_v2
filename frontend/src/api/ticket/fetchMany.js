import apiUtils from "../util";

const { useFetch } = apiUtils;

const TICKETS_URL = "/api/tickets/";

const useFetchTickets = (
  { parent_id, include, thing_ids } = {},
  { lazy = false } = {},
) => {
  const urlBuilder = (url, params) => {
    const { parent_id, include, thing_ids, open } = params;
    if (parent_id !== undefined) {
      url.searchParams.append("parent_id", parent_id);
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

    // set the thing_ids param if provided
    if (thing_ids) {
      if (Array.isArray(thing_ids)) {
        thing_ids.forEach((id) => url.searchParams.append("thing_ids", id));
      } else {
        url.searchParams.append("thing_ids", thing_ids);
      }
    }

    // set the filter for open tickets only
    if (open !== undefined) {
      url.searchParams.append("open", open);
    }

    return url;
  };

  const { data, count, loading, error, fetchData } = useFetch(
    TICKETS_URL,
    urlBuilder,
    { parent_id, include, thing_ids },
    { lazy },
  );

  return { data, count, loading, error, refetch: fetchData };
};

export default useFetchTickets;
