import { useEffect, useState } from "react";

import useApi from "../../api";
import components from "../../components";
import useTicketQueryParams from "../../queryParams/useTicketQueryParams";
import useViewNavigation from "../../navigation";

const {
  modals: {
    controllers: { useCategoryModalControl },
  },
} = components;

const useCategoryViewHooks = () => {
  // category names, actionType, ticketCategory, thingCategory, ticketLinkType
  const [categoryName, setCategoryName] = useState("actionType");
  // API object
  const api = {
    actionType: {
      list: useApi.action.fetchTypes(),
      create: useApi.action.createType(),
      update: useApi.action.updateType(),
    },
    ticketCategory: {
      list: useApi.ticket.fetchCategories(),
      create: useApi.ticket.createCategory(),
      update: useApi.ticket.updateCategory(),
    },
    thingCategory: {
      list: useApi.thing.fetchCategories(),
      create: useApi.thing.createCategory(),
      update: useApi.thing.updateCategory(),
    },
    ticketLinkType: {
      list: useApi.ticket.links.fetchTypes(),
      create: useApi.ticket.links.createType(),
      update: useApi.ticket.links.updateType(),
    },
  };
  api.refreshAll = () => {
    api.actionType.list.fetchData();
    api.ticketCategory.list.fetchData();
    api.thingCategory.list.fetchData();
    api.ticketLinkType.list.fetchData();
  };
  // Modal Control
  const modalControl = useCategoryModalControl(api, categoryName);

  return {
    categoryName,
    setCategoryName,
    api,
    modalControl,
  };
};

export default useCategoryViewHooks;
