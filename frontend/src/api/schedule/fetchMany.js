import apiUtils from "../util";

const { useFetch } = apiUtils;

const SCHEDULES_URL = "/api/schedules/";

const useFetchSchedules = (params) => {
  const urlBuilder = (url, params) => {
    const { pageNumber, pageSize } = params || {};
    if (pageNumber !== undefined) {
      url.searchParams.append("page_number", pageNumber);
    }
    if (pageSize !== undefined) {
      url.searchParams.append("page_size", pageSize);
    }
    return url;
  };
  const { data, count, loading, error, fetchData } = useFetch(
    SCHEDULES_URL,
    urlBuilder,
    params,
  );

  return { data, count, loading, error, fetchData };
};

export default useFetchSchedules;
