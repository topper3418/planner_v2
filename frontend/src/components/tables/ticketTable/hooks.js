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
  const queryParams = {
    thing_ids: selectedThingId
      ? [selectedThingId]
      : checkedThingIds
        ? checkedThingIds
        : [],
    include: ["thing", "category"],
    open: showClosed ? undefined : true,
  };
  // initialize state
  const { data, count, loading, error, refetch } = useApi.ticket.fetchMany(
    queryParams,
    { lazy: true },
  );

  console.log("useTicketTableHooks - queryParams:", queryParams);
  console.log("useTicketTableHooks - data:", data);
  console.log("useTicketTableHooks - count:", count);

  // set default table mode
  if (!tableMode) tableMode = "full"; // other option is "compact"

  //helper function
  const doRefetch = () => {
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

  // on mount and when checkedThingIds or selectedThingId changes, refetch data
  useEffect(() => {
    doRefetch();
  }, [checkedThingIds, selectedThingId, showClosed]);

  const getRowClassName = (record) => {
    // if its selected, highlight it
    if (record.id == selectedTicketId) return "selected-row";
    // if its closed, gray it out
    if (!record.open) return "grey-row";
  };

  return {
    data,
    loading,
    error,
    doRefetch,
    count,
    handleShowClosedToggle,
    showClosedToggleText,
    getRowClassName,
  };
};

export default useTicketTableHooks;
