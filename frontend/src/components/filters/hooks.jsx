import useApi from "../../../api";
import { useEffect, useState } from "react";
import useViewNavigation from "../../../navigation";

const useFilterHooks = () => {
  // navigation hook
  const navigation = useViewNavigation();
  // initialize query params for consistency throughout component
  const queryParams = {
    thing_ids: navigation.getQueryParam.thingIds,
    include: ["thing", "category"],
    search: navigation.getQueryParam.search || undefined,
    category_ids: navigation.getQueryParam.ticketCategoryIds || undefined,
    category_id: navigation.getQueryParam.ticketCategoryId || undefined,
    open: navigation.getQueryParam.showClosed ? undefined : true,
    milestone_id: navigation.getQueryParam.milestoneId || undefined,
    user_id: navigation.getQueryParam.userId || undefined,
    page_number: pageNumber,
    page_size: pageSize,
  };

  return {
    navigation,
    handleShowClosedToggle,
    showClosedToggleText,
    getRowClassName,
    onSearchChange,
  };
};

export default useFilterHooks;
