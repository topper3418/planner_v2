import ThingImports from "./thingModal";
import TicketImports from "./ticketModal";
import UserModalImports from "./userModal";
import MilestoneModalImports from "./milestoneModal";
import ScheduleModalImports from "./scheduleModal";

const modals = {
  MilestoneModal: MilestoneModalImports.MilestoneModal,
  ScheduleModal: ScheduleModalImports.ScheduleModal,
  UserModal: UserModalImports.UserModal,
  TicketModal: TicketImports.TicketModal,
  ThingModal: ThingImports.ThingModal,
  buffers: {
    useMilestoneBuffer: MilestoneModalImports.useMilestoneBuffer,
    useScheduleBuffer: ScheduleModalImports.useScheduleBuffer,
    useUserBuffer: UserModalImports.useUserBuffer,
    useTicketBuffer: TicketImports.useTicketBuffer,
    useThingBuffer: ThingImports.useThingBuffer,
  },
  controllers: {
    useMilestoneModalControl: MilestoneModalImports.useMilestoneModalControl,
    useScheduleModalControl: ScheduleModalImports.useScheduleModalControl,
    useUserModalControl: UserModalImports.useUserModalControl,
    useTicketModalControl: TicketImports.useTicketModalControl,
    useThingModalControl: ThingImports.useThingModalControl,
  },
};

export default modals;
