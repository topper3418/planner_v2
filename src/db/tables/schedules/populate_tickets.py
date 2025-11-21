def populate_tickets(self: "Schedule") -> None:
    from ..tickets import Ticket, TicketParams

    params = TicketParams(schedule_id=self.id)

    ticket_data = Ticket.read(params)
    print("found tickets:", ticket_data)
    self.tickets = ticket_data.data
