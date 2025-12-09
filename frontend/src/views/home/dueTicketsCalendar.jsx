import { Card, Col, Flex, Row, Typography } from "antd";
import useApi from "../../api";

const DueTicketsCalendar = () => {


  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  // get the first day of the month
  const firstDayOfMonth = new Date(year, month, 1)
  const firstDayOfMonthOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
  // round back to the previous Monday
  const offset = firstDayOfMonthOfWeek === 0 ? 6 : firstDayOfMonthOfWeek - 1;
  const firstDayInCalendar = new Date(year, month, 1 - offset);
  const weeks = 6; // Always show 6 weeks to cover all month lengths
  const lastDayInCalendar = new Date(year, month, 1 - offset + (weeks * 7) - 1);

  const ticketParams = {
    due_date_after: firstDayInCalendar.toISOString(),
    due_date_before: lastDayInCalendar.toISOString(),
    open: true,
    include: ['category'],
    page_size: 10000,
  }

  const ticketsApi = useApi.ticket.fetchMany(ticketParams);
  const milestonesApi = useApi.milestone.fetchMany();

  const ticketsDateMap = ticketsApi?.data?.reduce((acc, ticket) => {
    const dueDate = ticket.due_date ? ticket.due_date.split("T")[0] : null;
    if (dueDate) {
      if (!acc[dueDate]) {
        acc[dueDate] = [];
      }
      acc[dueDate].push(ticket);
    }
    return acc;
  }, {}) || {};
  const milestonesStartDateMap = milestonesApi?.data?.reduce((acc, milestone) => {
    const startDate = milestone.start_date ? milestone.start_date.split("T")[0] : null;
    if (startDate) {
      if (!acc[startDate]) {
        acc[startDate] = [];
      }
      acc[startDate].push(milestone);
    }
    return acc;
  }, {}) || {};
  const milestonesDueDateMap = milestonesApi?.data?.reduce((acc, milestone) => {
    const dueDate = milestone.due_date ? milestone.due_date.split("T")[0] : null;
    if (dueDate) {
      if (!acc[dueDate]) {
        acc[dueDate] = [];
      }
      acc[dueDate].push(milestone);
    }
    return acc;
  }, {}) || {};

  let dayCursor = new Date(firstDayInCalendar);

  return (
    <Card title={`${monthName} ${year}`} style={{ width: '1300px' }}>
      <Flex vertical>
        <Row justify="space-between">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <Col span={3} key={day}>
              <Typography.Text strong>{day}</Typography.Text>
            </Col>
          ))}
        </Row>
        {Array.from({ length: weeks }).map((_, week) => (
          <Row justify="space-between" key={week}>
            {Array.from({ length: 7 }).map((_, day) => {
              const dayDate = new Date(dayCursor);
              const displayDate = dayDate.getDate();
              const isCurrentMonth = dayDate.getMonth() === month;
              dayCursor.setDate(dayCursor.getDate() + 1);
              const ticketsForDay = ticketsDateMap[dayDate.toISOString().split("T")[0]] || [];
              const milestonesStartingToday = milestonesStartDateMap[dayDate.toISOString().split("T")[0]] || [];
              const milestonesDueToday = milestonesDueDateMap[dayDate.toISOString().split("T")[0]] || [];

              return (
                <Col span={3} key={day} style={{ minHeight: '100px', border: '1px solid #f0f0f0', padding: '8px' }}>
                  <Typography.Text style={{ color: isCurrentMonth ? 'white' : 'gray' }}>
                    {displayDate}
                  </Typography.Text>
                  <Flex vertical gap="4px" style={{ marginTop: '4px' }}>
                    {ticketsForDay.map((ticket) => (
                      <Typography.Paragraph
                        key={ticket.id}
                        ellipsis={{ rows: 1, expandable: false }}
                        onClick={() => {
                          window.location.href = `/tickets/${ticket.id}`;
                        }}
                        style={{
                          backgroundColor: ticket.category ? ticket.category.color : '#d9d9d9',
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
                    {milestonesStartingToday.map((milestone) => (
                      <Typography.Paragraph
                        key={milestone.id}
                        ellipsis={{ rows: 1, expandable: false }}
                        onClick={() => {
                          window.location.href = `/milestones/${milestone.id}`;
                        }}
                        style={{
                          backgroundColor: '#52c41a',
                          color: '#fff',
                          cursor: 'pointer',
                          padding: '2px 4px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          margin: 0,
                        }}>
                        🚀 {milestone.name} (Start)
                      </Typography.Paragraph>
                    ))}
                    {milestonesDueToday.map((milestone) => (
                      <Typography.Paragraph
                        key={milestone.id}
                        ellipsis={{ rows: 1, expandable: false }}
                        onClick={() => {
                          window.location.href = `/milestones/${milestone.id}`;
                        }}
                        style={{
                          backgroundColor: '#faad14',
                          color: '#fff',
                          cursor: 'pointer',
                          padding: '2px 4px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          margin: 0,
                        }}>
                        ⏰ {milestone.name} (Due)
                      </Typography.Paragraph>
                    ))}
                  </Flex>
                </Col>
              );
            })}
          </Row>
        ))}
      </Flex>
    </Card>
  );
};

export default DueTicketsCalendar;
