import apiUtils from "../util";

const { useFetchCount } = apiUtils;

const GET_TICKET_COUNT_URL = "/api/tickets/count";

const useFetchTicketCount = (
  {
    parent_id,
    include,
    thing_ids,
    open,
    page_number,
    page_size,
    category_id,
    search,
    milestone_id,
    schedule_id,
    user_id,
  } = {},
  { lazy = false } = {},
) => {
  const urlBuilder = (url, params) => {
    const {
      parent_id,
      include,
      thing_ids,
      open,
      page_number,
      page_size,
      category_id,
      search,
      milestone_id,
      schedule_id,
      user_id,
    } = params;
    if (parent_id !== undefined) {
      url.searchParams.append("parent_id", parent_id);
    }

    if (user_id !== undefined) {
      url.searchParams.append("user_id", user_id);
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

    // set search filter if provided
    if (search !== undefined) {
      url.searchParams.append("search", search);
    }

    // set category_id filter if provided
    if (category_id !== undefined) {
      url.searchParams.append("category_id", category_id);
    }

    // set milestone_id filter if provided
    if (milestone_id !== undefined) {
      url.searchParams.append("milestone_id", milestone_id);
    }

    // set schedule_id filter if provided
    if (schedule_id !== undefined) {
      url.searchParams.append("schedule_id", schedule_id);
    }

    // set pagination params if provided
    if (page_number !== undefined) {
      url.searchParams.append("page_number", page_number);
    }
    if (page_size !== undefined) {
      url.searchParams.append("page_size", page_size);
    }

    return url;
  };
  const { count, loading, error, fetchCount } = useFetchCount(
    GET_TICKET_COUNT_URL,
    urlBuilder,
    {
      parent_id,
      include,
      thing_ids,
      open,
      page_number,
      page_size,
      category_id,
      search,
      milestone_id,
      schedule_id,
      user_id,
    },
    { lazy },
  );

  return { count, loading, error, fetchCount };
};

export default useFetchTicketCount;
