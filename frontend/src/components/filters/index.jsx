import { Button, Flex, Input } from "antd";
import TicketCategoryDropdown from "../inputs/ticketCategoryDropdown";
import MilestoneDropdown from "../inputs/milestoneDropdown";
import UserMultiDropdown from "../inputs/userMultiDropdown";
import useViewNavigation from "../../navigation";
import { useState } from "react";

const Filters = () => {
  const navigation = useViewNavigation();

  const onSearchChange = (e) => {
    const value = e.target.value;
    console.log("new search value:", navigation.getQueryParam.search, "->", value);
    console.log("Setting search to", value);
    navigation.setQueryParam.search(value);
  };

  const handleShowClosedToggle = () => {
    console.log("Setting showClosed to", !navigation.getQueryParam.showClosed);
    if (!navigation.getQueryParam.showClosed) {
      setShowToggleText("Hide Closed");
      navigation.setQueryParam.showClosed(true);
    } else {
      setShowToggleText("Show Closed");
      navigation.setQueryParam.showClosed(false);
    }
  };

  const [showClosedToggleText, setShowToggleText] = useState(
    navigation.getQueryParam.showClosed ? "Hide Closed" : "Show Closed",
  );

  return (
    <Flex gap="10px">
      <Input
        placeholder="Search"
        style={{ width: 100 }}
        value={navigation.getQueryParam.search || ''}
        onChange={onSearchChange} />
      <UserMultiDropdown
        selectedUserIds={navigation.getQueryParam.userIds}
        setSelectedUserIds={navigation.setQueryParam.userIds} />
      <MilestoneDropdown
        selectedMilestoneId={navigation.getQueryParam.milestoneId}
        setSelectedMilestoneId={navigation.setQueryParam.milestoneId} />
      <TicketCategoryDropdown
        selectedCategoryId={navigation.getQueryParam.ticketCategoryId}
        setSelectedCategoryId={navigation.setQueryParam.ticketCategoryId} />
      <Button
        onClick={handleShowClosedToggle}>
        {showClosedToggleText}
      </Button>
    </Flex >
  )
}

export default Filters;
