import { Card, Flex } from "antd";
import components from "../../components";
import useHomeViewHooks from "./hooks";
import useApi from "../../api";


const {
  tables: { MilestoneList, TicketList },
  details: { MilestoneDetails, MilestoneModal },
  Charts: { UserTicketsPie, TopThingTicketsPie }
} = components;

const HomeView = () => {
  return (
    <Flex gap="10px">
      <Card
        title="Open Tickets by User"
        style={{ minHeight: "400px" }}>
        <UserTicketsPie />
      </Card>
      <Card
        title="Open Tickets by Top Things"
        style={{ minHeight: "400px" }}>
        <TopThingTicketsPie />
      </Card>
    </Flex>
  );
}

export default HomeView;
