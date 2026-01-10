import apiUtils from "../../util";

const { useFetch } = apiUtils;

const useFetchLinks = (
  ticketId,
  { link_category_id, include } = {},
  { lazy = false } = {},
) => {
  const LINKS_URL = `/api/tickets/${ticketId}/links`;
  const urlBuilder = (url, params) => {
    const { link_category_id, include } = params;
    if (link_category_id !== undefined) {
      url.searchParams.append("link_category_id", link_category_id);
    }
    if (include !== undefined) {
      if (Array.isArray(include)) {
        include.forEach((inc) => url.searchParams.append("include", inc));
      } else {
        url.searchParams.append("include", include);
      }
    }
    console.log("Fetching links with url", url.toString());
    return url;
  };

  const { data, count, loading, error, fetchData } = useFetch(
    LINKS_URL,
    urlBuilder,
    {
      link_category_id,
      include,
    },
    { lazy },
  );

  return { data, count, loading, error, fetchData };
};

export default useFetchLinks;
