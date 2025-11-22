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
      search: searchParams.get("search"),
      ticketId: urlParams.ticketId || searchParams.get("ticketId"),
      thingIds: urlParams.thingId
        ? [urlParams.thingId]
        : searchParams.getAll("thingIds")?.[0]?.split(",")?.map(Number),
      showClosed: searchParams.get("showClosed") === "true",
      milestoneId: urlParams.milestoneId || searchParams.get("milestoneId"),
      scheduleId: urlParams.scheduleId || searchParams.get("scheduleId"),
      userId: urlParams.userId || searchParams.get("userId"),
      ticketCategoryIds: searchParams.get("ticketCategoryIds"),
      ticketCategoryId:
        urlParams.ticketCategoryId || searchParams.get("ticketCategoryId"),
      pageNumber: parseInt(searchParams.get("pageNumber")) || 1,
      pageSize: parseInt(searchParams.get("pageSize")) || 25,
    }),
    [
      urlParams,
      searchParams, // only this changes
    ],
  );
  const setQueryParam = {
    ticketId: (ticketId) => {
      setSearchParms((prev) => {
        prev.delete("pageNumber");
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
        prev.delete("pageNumber");
        if (!thingIds) {
          prev.delete("thingIds");
          return prev;
        }
        prev.set("thingIds", thingIds);
        return prev;
      });
    },
    showClosed: (showClosed) => {
      setSearchParms((prev) => {
        prev.delete("pageNumber");
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
        prev.delete("pageNumber");
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
        prev.delete("pageNumber");
        if (!userId && userId !== 0) {
          prev.delete("userId");
          return prev;
        }
        prev.set("userId", userId);
        return prev;
      });
    },
    ticketCategoryIds: (ticketCategoryIds) => {
      setSearchParms((prev) => {
        prev.delete("pageNumber");
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
        prev.delete("pageNumber");
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
        prev.delete("pageNumber");
        if (!search) {
          prev.delete("search");
          return prev;
        }
        prev.set("search", search);
        return prev;
      });
    },
    pageNumber: (pageNumber) => {
      setSearchParms((prev) => {
        if (!pageNumber) {
          prev.delete("pageNumber");
          return prev;
        }
        prev.set("pageNumber", pageNumber);
        return prev;
      });
    },
    pageSize: (pageSize) => {
      setSearchParms((prev) => {
        prev.delete("pageNumber");
        if (!pageSize) {
          prev.delete("pageSize");
          return prev;
        }
        prev.set("pageSize", pageSize);
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
