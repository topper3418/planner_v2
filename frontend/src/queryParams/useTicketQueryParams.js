const useTicketQueryParams = (queryParams) => {
  const pageSize = queryParams.pageSize || 25;
  const pageNumber = queryParams.pageNumber || 1;
  return {
    thing_ids: queryParams.thingIds,
    include: ["thing", "category"],
    search: queryParams.search || undefined,
    category_ids: queryParams.ticketCategoryIds || undefined,
    category_id: queryParams.ticketCategoryId || undefined,
    open: queryParams.showClosed ? undefined : true,
    milestone_id: queryParams.milestoneId || undefined,
    schedule_id: queryParams.scheduleId || undefined,
    user_id: queryParams.userId || undefined,
    page_number: pageNumber,
    page_size: pageSize,
  };
};

export default useTicketQueryParams;
