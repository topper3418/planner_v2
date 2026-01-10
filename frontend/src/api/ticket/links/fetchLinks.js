import apiUtils from "../../util";

const { useFetch } = apiUtils;

const TICKETS_URL = "/api/tickets/";

const useFetchLinks = (
  ticketId,
  { link_category_id } = {},
  { lazy = false } = {},
) => {
  const LINKS_URL = `/api/tickets/${ticketId}/links/`;
  const urlBuilder = (url, params) => {
    const { link_category_id } = params;
    if (link_category_id !== undefined) {
      url.searchParams.append("link_category_id", link_category_id);
    }
    return url;
  };

  const { data, count, loading, error, fetchData } = useFetch(
    LINKS_URL,
    urlBuilder,
    {
      link_category_id,
    },
    { lazy },
  );

  return { data, count, loading, error, fetchData };
};

export default useFetchLinks;
