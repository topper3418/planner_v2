import { startOfLocalDay } from '../../util/dates';

/** @deprecated Prefer startOfLocalDay from util/dates — re-exported for DRY. */
export const startOfDay = startOfLocalDay;

export const isDayInFuture = (dayDate, currentDate) => (
  startOfLocalDay(dayDate) > startOfLocalDay(currentDate)
);

export const isScheduledTicket = (ticket) => ticket.schedule_id != null;

export const filterCalendarTickets = (tickets, { dayEnd, completedTicketIds }) => (
  tickets.filter((ticket) => {
    if (ticket.open === false && !isScheduledTicket(ticket)) {
      return false;
    }

    const createdAt = new Date(ticket.created_at);
    if (createdAt > dayEnd && !ticket.due_date) {
      return false;
    }

    if (completedTicketIds.includes(ticket.id)) {
      return false;
    }

    return true;
  })
);

export const getTicketChipStyle = (
  ticket,
  { completedTicketIds, dayDate, currentDate },
) => {
  const completedOnDay = completedTicketIds.includes(ticket.id) || ticket.isCompletedTicket;
  if (completedOnDay) {
    return {
      backgroundColor: '#52c41a',
      color: '#fff',
      opacity: 1,
    };
  }

  const baseColor = ticket.category ? ticket.category.color : '#d9d9d9';
  const isClosedFutureScheduled = (
    isScheduledTicket(ticket)
    && ticket.open === false
    && isDayInFuture(dayDate, currentDate)
  );

  return {
    backgroundColor: baseColor,
    color: '#fff',
    opacity: isClosedFutureScheduled ? 0.45 : 1,
  };
};