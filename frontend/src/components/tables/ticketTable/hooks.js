import useApi from "../../../api";
import { useEffect, useState } from "react";
import useViewNavigation from "../../../navigation";
import useTicketQueryParams from "../../../queryParams/useTicketQueryParams";

const useTicketTableHooks = (tableMode) => {
  // navigation hook
  const navigation = useViewNavigation();
  // initialize query params for consistency throughout component
  const [showClosedToggleText, setShowToggleText] = useState(
    navigation.getQueryParam.showClosed ? "Hide Closed" : "Show Closed",
  );
  const pageSize = navigation.getQueryParam.pageSize || 25;
  const pageNumber = navigation.getQueryParam.pageNumber || 1;
  const queryParams = useTicketQueryParams(navigation.getQueryParam);
  // initialize state
  const { data, count, loading, error, fetchData } = useApi.ticket.fetchMany(
    queryParams,
    { lazy: true },
  );

  // set default table mode
  if (!tableMode) tableMode = "full"; // other option is "compact"

  //helper function
  const doRefetch = () => {
    fetchData(queryParams);
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

  const pagination = {
    pageSize,
    simple: true,
    size: "small",
    current: pageNumber,
    total: count,
    onChange: (page) => {
      navigation.setQueryParam.pageNumber(page);
    },
  };

  const onSearchChange = (e) => {
    const value = e.target.value;
    navigation.setQueryParam.search(value);
  };

  const queryParamDeps = [
    navigation.getQueryParam.thingIds,
    navigation.getQueryParam.showClosed,
    navigation.getQueryParam.milestoneId,
    navigation.getQueryParam.userId,
    navigation.getQueryParam.search,
    navigation.getQueryParam.ticketCategoryIds,
    pageNumber,
    pageSize,
  ];

  // on mount and when checkedThingIds or selectedThingId changes, refetch data
  useEffect(() => {
    doRefetch();
  }, queryParamDeps);

  const getRowClassName = (record) => {
    // if its selected, highlight it
    if (record.id == navigation.urlParams.ticketId) return "selected-row";
    // if its closed, gray it out
    if (!record.open) return "grey-row";
  };

  return {
    navigation,
    data,
    count,
    loading,
    error,
    doRefetch,
    pagination,
    handleShowClosedToggle,
    showClosedToggleText,
    getRowClassName,
    onSearchChange,
  };
};

export default useTicketTableHooks;
