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
      // milestoneId: urlParams.milestoneId || searchParams.get("milestoneId"),
      // milestoneIds: urlParams.milestoneId
      //   ? [urlParams.milestoneId]
      //   : searchParams.getAll("milestoneIds")?.[0]?.split(",")?.map(Number),
      scheduleId: urlParams.scheduleId || searchParams.get("scheduleId"),
      userId: urlParams.userId || searchParams.get("userId"),
      userIds: urlParams.userId
        ? [urlParams.userId]
        : searchParams.getAll("userIds")?.[0]?.split(",")?.map(Number),
      ticketCategoryId:
        urlParams.ticketCategoryId || searchParams.get("ticketCategoryId"),
      ticketCategoryIds: searchParams
        .getAll("ticketCategoryIds")?.[0]
        ?.split(",")
        ?.map(Number),
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
        if (!thingIds || thingIds.length === 0) {
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
    // milestoneId: (milestoneId) => {
    //   setSearchParms((prev) => {
    //     prev.delete("pageNumber");
    //     if (!milestoneId) {
    //       prev.delete("milestoneId");
    //       return prev;
    //     }
    //     prev.set("milestoneId", milestoneId);
    //     return prev;
    //   });
    // },
    // milestoneIds: (milestoneIds) => {
    //   setSearchParms((prev) => {
    //     prev.delete("pageNumber");
    //     if (!milestoneIds || milestoneIds.length === 0) {
    //       prev.delete("milestoneIds");
    //       return prev;
    //     }
    //     prev.set("milestoneIds", milestoneIds);
    //     return prev;
    //   });
    // },
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
    userIds: (userIds) => {
      console.log("setting userIds to:", userIds);
      setSearchParms((prev) => {
        prev.delete("pageNumber");
        if (!userIds || userIds.length === 0) {
          console.log("deleting userIds from params");
          prev.delete("userIds");
          return prev;
        }
        prev.set("userIds", userIds);
        return prev;
      });
    },
    ticketCategoryIds: (ticketCategoryIds) => {
      setSearchParms((prev) => {
        prev.delete("pageNumber");
        if (!ticketCategoryIds || ticketCategoryIds.length === 0) {
          prev.delete("ticketCategoryIds");
          return prev;
        }
        console.log("setting ticketCategoryIds to:", ticketCategoryIds);
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

  const navigateWithParams = (path) => {
    const fullPath = `${path}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    navigate(fullPath);
  };

  const clearParams = () => {
    setSearchParms({});
  };

  return {
    getQueryParam,
    setQueryParam,
    navigateWithParams,
    location,
    urlParams,
    searchParams,
    setSearchParms,
    navigate,
    clearParams,
  };
};

export default useViewNavigation;
