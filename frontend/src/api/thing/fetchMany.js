import apiUtils from "../util";

const { useFetch } = apiUtils;

const THINGS_URL = "/api/things/";

const useFetchThings = (
  { parent_id, include, page_number, page_size } = {},
  { lazy = false } = {},
) => {
  const urlBuilder = (url, params) => {
    console.log("building URL with params:", params);
    const { parent_id, include, page_number, page_size } = params;
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
    if (page_number !== undefined) {
      url.searchParams.append("page_number", page_number);
    }
    if (page_size !== undefined) {
      url.searchParams.append("page_size", page_size);
    }
    console.log("Built URL:", url.toString());
    return url;
  };

  const { data, loading, error, fetchData } = useFetch(
    THINGS_URL,
    urlBuilder,
    { parent_id, include, page_number, page_size },
    { lazy },
  );

  return { data, loading, error, refetch: fetchData };
};

export default useFetchThings;
