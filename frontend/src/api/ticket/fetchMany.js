import apiUtils from "../util";

const { useFetch } = apiUtils;

const TICKETS_URL = "/api/tickets/";

const useFetchTickets = (
  {
    parent_id,
    include,
    thing_ids,
    open,
    page_number,
    page_size,
    category_id,
    category_ids,
    search,
    milestone_id,
    milestone_ids,
    due_date_before,
    due_date_after,
    schedule_id,
    scheduled,
    user_id,
    user_ids,
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
      category_ids,
      search,
      milestone_id,
      milestone_ids,
      due_date_before,
      due_date_after,
      schedule_id,
      scheduled,
      user_id,
      user_ids,
    } = params;
    if (parent_id !== undefined) {
      url.searchParams.append("parent_id", parent_id);
    }

    if (user_id !== undefined) {
      url.searchParams.append("user_id", user_id);
    }
    if (user_ids !== undefined) {
      if (Array.isArray(user_ids)) {
        user_ids.forEach((id) => url.searchParams.append("user_ids", id));
      } else {
        url.searchParams.append("user_ids", user_ids);
      }
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

    // set category_ids filter if provided
    if (category_ids !== undefined) {
      if (Array.isArray(category_ids)) {
        category_ids.forEach((id) =>
          url.searchParams.append("category_ids", id),
        );
      } else {
        url.searchParams.append("category_ids", category_ids);
      }
    }

    // set milestone_id filter if provided
    if (milestone_id !== undefined) {
      url.searchParams.append("milestone_id", milestone_id);
    }

    // set milestone_ids filter if provided
    if (milestone_ids !== undefined) {
      if (Array.isArray(milestone_ids)) {
        milestone_ids.forEach((id) =>
          url.searchParams.append("milestone_ids", id),
        );
      } else {
        url.searchParams.append("milestone_ids", milestone_ids);
      }
    }

    // set due_date_before filter if provided
    if (due_date_before !== undefined) {
      url.searchParams.append("due_date_before", due_date_before);
    }
    // set due_date_after filter if provided
    if (due_date_after !== undefined) {
      url.searchParams.append("due_date_after", due_date_after);
    }

    // set schedule_id filter if provided
    if (schedule_id !== undefined) {
      url.searchParams.append("schedule_id", schedule_id);
    }

    // set scheduled filter if provided
    if (scheduled !== undefined) {
      url.searchParams.append("scheduled", scheduled);
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

  const { data, count, loading, error, fetchData } = useFetch(
    TICKETS_URL,
    urlBuilder,
    {
      parent_id,
      include,
      thing_ids,
      open,
      page_number,
      page_size,
      category_id,
      category_ids,
      search,
      milestone_id,
      milestone_ids,
      due_date_before,
      due_date_after,
      schedule_id,
      scheduled,
      user_id,
      user_ids,
    },
    { lazy },
  );

  return { data, count, loading, error, fetchData };
};

export default useFetchTickets;
