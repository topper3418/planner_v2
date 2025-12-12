import { Col, Flex, Typography } from "antd";
import useApi from "../../api";

const CalendarDay = ({
  dayDate, month
}) => {
  const todosApi = useApi.ticket.fetchTodos({ date: dayDate });
  // get locale-adjusted start and end stamps for the day
  const dayStart = new Date(dayDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayDate);
  dayEnd.setHours(23, 59, 59, 999);
  const completionsApi = useApi.action.fetchMany({
    category_name: 'Completed',
    performed_before: dayEnd.toISOString(),
    performed_after: dayStart.toISOString(),
  })
  const tickets = (todosApi?.data || []).map((todo) => {
    const isCompletedTicket = todo?.open === false && todo.schedule_id === null;
    return { ...todo, isCompletedTicket };
  });
  const displayDate = dayDate.getDate();
  const isCurrentMonth = dayDate.getMonth() === month;

  const completedTicketIds = completionsApi?.data?.map((completion) => completion.ticket_id) || [];
  // filter tickets out if they were created after this day
  const filteredTickets = tickets.filter((ticket) => {
    const createdAt = new Date(ticket.created_at);
    return createdAt <= dayEnd;
  });
  return (
    <Col span={3} style={{ minHeight: '100px', border: '1px solid #f0f0f0', padding: '8px' }}>
      <Typography.Text style={{ color: isCurrentMonth ? 'white' : 'gray' }}>
        {displayDate}
      </Typography.Text>
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
  );
};

export default CalendarDay;
