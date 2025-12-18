import { Button, Col, Flex, List, Popover, Typography } from "antd";
import useApi from "../../api";
import components from "../../components";

const { TicketModal, controllers: { useTicketModalControl } } = components.modals;

const CalendarDay = ({
  dayDate, month, currentDate,
}) => {
  // get locale-adjusted start and end stamps for the day
  const dayStart = new Date(dayDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayDate);
  dayEnd.setHours(23, 59, 59, 999);
  const todosParams = {
    date: dayDate,
    page_size: 1000,
  }
  const todosApi = useApi.ticket.fetchTodos(todosParams);
  const completionsParams = {
    action_type_name: 'Completed',
    include: ['ticket'],
    performed_before: dayEnd.toISOString(),
    performed_after: dayStart.toISOString(),
  }
  const completionsApi = useApi.action.fetchMany(completionsParams);
  const api = {
    ticket: {
      todos: todosApi,
      create: useApi.ticket.create(),
    },
    actions: {
      completions: completionsApi,
    },
    refreshAll: () => {
      todosApi.fetchData(todosParams);
      completionsApi.fetchData(completionsParams);
    }
  }
  // debug print if it's the 12th day of the month
  if (dayDate.getDate() === 12) {
    console.log("todosApi data", todosApi?.data);
  }
  const tickets = (todosApi?.data || []).map((todo) => {
    const isCompletedTicket = todo?.open === false && todo.schedule_id === null;
    return { ...todo, isCompletedTicket };
  });
  const displayDate = dayDate.getDate();
  const isCurrentMonth = dayDate.getMonth() === month;
  const isInPast = dayDate < currentDate

  const completedTicketIds = completionsApi?.data?.map((completion) => completion.ticket_id) || [];
  const filteredTickets = tickets.filter((ticket) => {
    // filter tickets out if they were created after this day
    // and it doesn't have a due date on this day
    const createdAt = new Date(ticket.created_at);
    if (createdAt > dayEnd && !ticket.due_date) {
      return false;
    }
    // filter tickets out if they are completed
    if (ticket.open === false) {
      return false;
    }
    // filter out tickets that are in the completedTicketIds list
    if (completedTicketIds.includes(ticket.id)) {
      return false;
    }
    return true;
  });
  const ticketModalControl = useTicketModalControl(api);
  return (<>
    <Col span={3} style={{ minHeight: '100px', border: '1px solid #f0f0f0', padding: '8px' }}>
      <Flex justify="space-between">
        <Typography.Text style={{ color: isCurrentMonth ? 'white' : 'gray' }}>
          {displayDate}
        </Typography.Text>
        <Flex gap="5px">
          <Button
            size="small"
            onClick={() => ticketModalControl.add.open({ dueDate: dayDate.toISOString() })}>
            +
          </Button>
          <Popover
            content={
              <List
                size="small"
                dataSource={completionsApi?.data || []}
                renderItem={(action) => (
                  <List.Item>
                    <ActionListItem action={action} />
                  </List.Item>
                )}
                style={{ maxHeight: '200px', overflowY: 'auto', width: '250px' }} />
            }
            placement="bottom"
            trigger="hover"
          >
            <Typography.Text style={{ color: '#52c41a' }}>
              {completedTicketIds.length}
            </Typography.Text>
          </Popover>
        </Flex>
      </Flex>
      <Flex vertical gap="4px" style={{ marginTop: '4px' }}>
        {filteredTickets.map((ticket) => (
          <Typography.Paragraph
            key={ticket.id}
            ellipsis={{ rows: 1, expandable: false }}
            onClick={() => {
              window.location.href = `/tickets/${ticket.id}`;
            }}
            style={{
              backgroundColor: (completedTicketIds.includes(ticket.id) || ticket.isCompletedTicket) ?
                '#52c41a' :
                (ticket.category ? ticket.category.color : '#d9d9d9'),
              color: '#fff',
              cursor: 'pointer',
              padding: '2px 4px',
              borderRadius: '4px',
              fontSize: '12px',
              margin: 0,
            }}>
            {ticket.title}
          </Typography.Paragraph>
        ))}
      </Flex>
    </Col>
    <TicketModal modalControl={ticketModalControl} />
  </>);
};


const ActionListItem = ({ action, navigation }) => {
  return (
    <Flex vertical>
      <Typography.Text
        style={{ cursor: 'pointer' }}
        onClick={() => {
          window.location.href = `/tickets/${action.ticket_id}`;
        }}
        strong>
        {action.ticket?.title || 'No Ticket'}
      </Typography.Text>
      <Typography.Paragraph ellipsis={{ rows: 2, expandable: true }}>
        {action.action_text}
      </Typography.Paragraph>
    </Flex>
  )
}

export default CalendarDay;
