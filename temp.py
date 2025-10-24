import src

Ticket = src.Controller.Tables.Ticket
TicketParams = src.Controller.Params.Ticket
QueryBuilder = src.Controller.QueryBuilder

params = TicketParams(
    # thing_ids=[1, 2, 3],
    open=True,
    include=["thing", "category"],
)

builder = QueryBuilder(Ticket, params)
builder.build_full()
tickets = Ticket.read(params)
from pprint import pprint

# pprint(Ticket.get_column_fields())
# print(builder.select)
# print(builder.query)
# print(builder.args)
pprint(tickets)
