import { Card, Flex } from "antd";
import OpenScheduledTicketTable from "./openScheduledTickets";
import MilestonePastDueTickets from "./milestonePastDueTickets";
import UserTicketsPie from "./userTicketsPie";
import TopThingTicketsPie from "./topThingTicketsPie";
import CompletedThisWeek from "./completedThisWeek";


const HomeView = () => {

  return (
    <Flex vertical gap="10px">
      <Flex gap="10px" style={{ overflowY: 'auto', flexWrap: 'wrap' }}>
        <CompletedThisWeek />
        <OpenScheduledTicketTable />
        <MilestonePastDueTickets />
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
    </Flex>
  );
}

export default HomeView;
