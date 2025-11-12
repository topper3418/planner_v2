import MilestoneDetails from "./milestoneDetails";
import ThingDetails from "./thingDetails";
import TicketDetails from "./ticketDetails/";
// import { ThingModal, useThingBuffer } from "./thingModal";
import ThingImports from "./thingModal";
// import { TicketModal, useTicketBuffer } from "./ticketModal";
import TicketImports from "./ticketModal";
// import { UserModal, useUserBuffer } from "./userModal";
import UserModalImports from "./userModal";
// import {
//   MilestoneModal,
//   useMilestoneBuffer,
//   useMilestoneModalControl,
// } from "./milestoneModal";
import MilestoneModalImports from "./milestoneModal";

const details = {
  ThingDetails,
  TicketDetails,
  MilestoneDetails,
  MilestoneModal: MilestoneModalImports.MilestoneModal,
  UserModal: UserModalImports.UserModal,
  TicketModal: TicketImports.TicketModal,
  ThingModal: ThingImports.ThingModal,
  buffers: {
    useMilestoneBuffer: MilestoneModalImports.useMilestoneBuffer,
    useUserBuffer: UserModalImports.useUserBuffer,
    useTicketBuffer: TicketImports.useTicketBuffer,
    useThingBuffer: ThingImports.useThingBuffer,
  },
  controllers: {
    useMilestoneModalControl: MilestoneModalImports.useMilestoneModalControl,
    useUserModalControl: UserModalImports.useUserModalControl,
    useTicketModalControl: TicketImports.useTicketModalControl,
    useThingModalControl: ThingImports.useThingModalControl,
  },
};

export default details;
