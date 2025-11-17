import { useMemo } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

const useViewNavigation = () => {
  const urlParams = useParams();
  const [searchParams, setSearchParms] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const getQueryParam = useMemo(
    () => ({
      ticketId: urlParams.ticketId || searchParams.get("ticketId"),
      thingIds: urlParams.thingId
        ? [urlParams.thingId]
        : searchParams.getAll("thingId"),
      showClosed: searchParams.get("showClosed") === "true",
      milestoneId: urlParams.milestoneId || searchParams.get("milestoneId"),
      userId: urlParams.userId || searchParams.get("userId"),
      ticketCategoryIds: searchParams.get("ticketCategoryIds"),
      ticketCategoryId:
        urlParams.ticketCategoryId || searchParams.get("ticketCategoryId"),
    }),
    [
      urlParams,
      searchParams, // only this changes
    ],
  );
  const setQueryParam = {
    ticketId: (ticketId) => {
      setSearchParms((prev) => {
        if (!ticketId) {
          prev.delete("ticketId");
          return prev;
        }
        prev.set("ticketId", ticketId);
        return prev;
      });
    },
    thingIds: (thingIds) => {
      setSearchParms((prev) => {
        if (!thingIds) {
          prev.delete("thingId");
          return prev;
        }
        prev.set("thingId", thingIds);
        return prev;
      });
    },
    showClosed: (showClosed) => {
      setSearchParms((prev) => {
        if (!showClosed) {
          prev.delete("showClosed");
          return prev;
        }
        prev.set("showClosed", showClosed);
        return prev;
      });
    },
    milestoneId: (milestoneId) => {
      setSearchParms((prev) => {
        if (!milestoneId) {
          prev.delete("milestoneId");
          return prev;
        }
        prev.set("milestoneId", milestoneId);
        return prev;
      });
    },
    userId: (userId) => {
      setSearchParms((prev) => {
        if (!userId) {
          prev.delete("userId");
          return prev;
        }
        prev.set("userId", userId);
        return prev;
      });
    },
    ticketCategoryIds: (ticketCategoryIds) => {
      setSearchParms((prev) => {
        if (!ticketCategoryIds) {
          prev.delete("ticketCategoryIds");
          return prev;
        }
        prev.set("ticketCategoryIds", ticketCategoryIds);
        return prev;
      });
    },
    ticketCategoryId: (ticketCategoryId) => {
      setSearchParms((prev) => {
        if (!ticketCategoryId) {
          prev.delete("ticketCategoryId");
          return prev;
        }
        prev.set("ticketCategoryId", ticketCategoryId);
        return prev;
      });
    },
    search: (search) => {
      setSearchParms((prev) => {
        if (!search) {
          prev.delete("search");
          return prev;
        }
        prev.set("search", search);
        return prev;
      });
    },
  };

  return {
    getQueryParam,
    setQueryParam,
    location,
    urlParams,
    searchParams,
    setSearchParms,
    navigate,
  };
};

export default useViewNavigation;
