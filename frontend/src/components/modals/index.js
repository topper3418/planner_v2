import ThingImports from "./thingModal";
import TicketImports from "./ticketModal";
import UserModalImports from "./userModal";
import MilestoneModalImports from "./milestoneModal";
import ScheduleModalImports from "./scheduleModal";
import CategoryModalImports from "./categoryModal";
import TicketLinkModalImports from "./ticketLinkModal";

const modals = {
  MilestoneModal: MilestoneModalImports.MilestoneModal,
  ScheduleModal: ScheduleModalImports.ScheduleModal,
  UserModal: UserModalImports.UserModal,
  TicketModal: TicketImports.TicketModal,
  ThingModal: ThingImports.ThingModal,
  CategoryModal: CategoryModalImports.CategoryModal,
  TicketLinkModal: TicketLinkModalImports.TicketLinkModal,
  buffers: {
    useMilestoneBuffer: MilestoneModalImports.useMilestoneBuffer,
    useScheduleBuffer: ScheduleModalImports.useScheduleBuffer,
    useUserBuffer: UserModalImports.useUserBuffer,
    useTicketBuffer: TicketImports.useTicketBuffer,
    useThingBuffer: ThingImports.useThingBuffer,
    useCategoryBuffer: CategoryModalImports.useCategoryBuffer,
    useTicketLinkBuffer: TicketLinkModalImports.useTicketLinkBuffer,
  },
  controllers: {
    useMilestoneModalControl: MilestoneModalImports.useMilestoneModalControl,
    useScheduleModalControl: ScheduleModalImports.useScheduleModalControl,
    useUserModalControl: UserModalImports.useUserModalControl,
    useTicketModalControl: TicketImports.useTicketModalControl,
    useThingModalControl: ThingImports.useThingModalControl,
    useCategoryModalControl: CategoryModalImports.useCategoryModalControl,
    useTicketLinkModalControl: TicketLinkModalImports.useTicketLinkModalControl,
  },
};

export default modals;
