import { Card, Col, Flex, Row, Typography } from "antd";
import CalendarDay from "./calendarDay";

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

  let dayCursor = new Date(firstDayInCalendar);

  return (
    <Card title={`${monthName} ${year}`} style={{ width: '1300px' }}>
      <Flex vertical>
        <Row justify="center">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <Col span={3} key={day}>
              <Typography.Text strong>{day}</Typography.Text>
            </Col>
          ))}
        </Row>
        {Array.from({ length: weeks }).map((_, week) => (
          <Row justify="center" key={week}>
            {Array.from({ length: 7 }).map(() => {
              const dayDate = new Date(dayCursor);
              dayCursor.setDate(dayCursor.getDate() + 1);
              return (
                <CalendarDay
                  currentDate={currentDate}
                  dayDate={dayDate}
                  month={month}
                  key={dayDate.toISOString()} />
              );
            })}
          </Row>
        ))}
      </Flex>
    </Card>
  );
};

export default DueTicketsCalendar;
