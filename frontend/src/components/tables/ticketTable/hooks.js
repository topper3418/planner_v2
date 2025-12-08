import useApi from "../../../api";
import { useEffect, useState } from "react";
import useViewNavigation from "../../../navigation";
import useTicketQueryParams from "../../../queryParams/useTicketQueryParams";

const useTicketTableHooks = (tableMode, ticketListApi) => {
  // navigation hook
  const navigation = useViewNavigation();
  // initialize query params for consistency throughout component
  const [showClosedToggleText, setShowToggleText] = useState(
    navigation.getQueryParam.showClosed ? "Hide Closed" : "Show Closed",
  );
  const pageSize = navigation.getQueryParam.pageSize || 25;
  const pageNumber = navigation.getQueryParam.pageNumber || 1;
  const queryParams = useTicketQueryParams(navigation.getQueryParam);

  // set default table mode
  if (!tableMode) tableMode = "full"; // other option is "compact"

  //helper function
  const doRefetch = () => {
    ticketListApi.fetchData(queryParams);
  };

  // onclick for the show closed button
  const handleShowClosedToggle = () => {
    console.log("Setting showClosed to", !showClosed);
    if (!showClosed) {
      setShowToggleText("Hide Closed");
      navigation.setQueryParam.showClosed(true);
    } else {
      setShowToggleText("Show Closed");
      navigation.setQueryParam.showClosed(false);
    }
  };

  // pagination config
  const pagination = {
    pageSize,
    simple: true,
    size: "small",
    current: pageNumber,
    total: ticketListApi.count,
    onChange: (page) => {
      navigation.setQueryParam.pageNumber(page);
    },
  };

  // handler for search input change
  const onSearchChange = (e) => {
    const value = e.target.value;
    navigation.setQueryParam.search(value);
  };

  // on mount and when checkedThingIds or selectedThingId changes, refetch data
  useEffect(() => {
    doRefetch();
  }, [
    navigation.getQueryParam.thingIds,
    navigation.getQueryParam.showClosed,
    navigation.getQueryParam.milestoneId,
    navigation.getQueryParam.milestoneIds,
    navigation.getQueryParam.userId,
    navigation.getQueryParam.userIds,
    navigation.getQueryParam.search,
    navigation.getQueryParam.ticketCategoryIds,
    pageNumber,
    pageSize,
  ]);

  // helper to get row class names in the table
  const getRowClassName = (record) => {
    // if its selected, highlight it
    if (record.id == navigation.urlParams.ticketId) return "selected-row";
    // if its closed, gray it out
    if (!record.open) return "grey-row";
  };

  return {
    navigation,
    doRefetch,
    pagination,
    handleShowClosedToggle,
    showClosedToggleText,
    getRowClassName,
    onSearchChange,
  };
};

export default useTicketTableHooks;
