import useApi from "../../../api";
import { useEffect, useState } from "react";

const useTicketTableHooks = (
  checkedThingIds,
  selectedThingId,
  tableMode,
  selectedTicketId,
) => {
  // initialize query params for consistency throughout component
  const [showClosed, setShowClosed] = useState(false);
  const [showClosedToggleText, setShowToggleText] = useState("Show Closed");
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedTicketCategoryId, setSelectedTicketCategoryId] =
    useState(null);
  const [search, setSearch] = useState(null);
  const queryParams = {
    thing_ids: selectedThingId
      ? [selectedThingId]
      : checkedThingIds
        ? checkedThingIds
        : [],
    include: ["thing", "category"],
    search: search ? search : undefined,
    category_id: selectedTicketCategoryId
      ? selectedTicketCategoryId
      : undefined,
    open: showClosed ? undefined : true,
    page_number: pageNumber,
    page_size: tableMode === "compact" ? 5 : 10,
  };
  // initialize state
  const { data, count, loading, error, refetch } = useApi.ticket.fetchMany(
    queryParams,
    { lazy: true },
  );

  // set default table mode
  if (!tableMode) tableMode = "full"; // other option is "compact"

  //helper function
  const doRefetch = () => {
    console.log("Refetching tickets with params:", queryParams);
    refetch(queryParams);
  };

  // onclick for the show closed button
  const handleShowClosedToggle = () => {
    console.log("Setting showClosed to", !showClosed);
    if (!showClosed) {
      setShowToggleText("Hide Closed");
      setShowClosed(true);
    } else {
      setShowToggleText("Show Closed");
      setShowClosed(false);
    }
  };

  const pagination = {
    pageSize: tableMode === "compact" ? 5 : 10,
    simple: true,
    size: "small",
    current: pageNumber,
    total: count,
    onChange: (page) => {
      setPageNumber(page);
    },
  };

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // on mount and when checkedThingIds or selectedThingId changes, refetch data
  useEffect(() => {
    doRefetch();
  }, [
    checkedThingIds,
    selectedThingId,
    showClosed,
    pageNumber,
    selectedTicketCategoryId,
    search,
  ]);

  const getRowClassName = (record) => {
    // if its selected, highlight it
    if (record.id == selectedTicketId) return "selected-row";
    // if its closed, gray it out
    if (!record.open) return "grey-row";
  };

  return {
    selectedTicketCategoryId,
    setSelectedTicketCategoryId,
    onSearchChange,
    search,
    data,
    loading,
    error,
    doRefetch,
    count,
    pagination,
    handleShowClosedToggle,
    showClosedToggleText,
    getRowClassName,
  };
};

export default useTicketTableHooks;
