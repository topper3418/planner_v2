import { Card, Flex, Table } from 'antd';
import useApi from '../../api';
import getColumns from '../../tableColumns/getTicketTableColumns';
import { useNavigate } from 'react-router-dom';

const PastDueTickets = () => {
  // get today's date to inform the due date before param, adjust for timezone
  const timezoneOffset = new Date().getTimezoneOffset() * 60000; // offset in milliseconds
  const today = new Date().getTime() - timezoneOffset;


  const openPastDueTicketParams = {
    open: true,
    include: ['thing', 'user', 'category'],
    page_size: 10000,
    due_date_before: new Date(today).toISOString().split('T')[0], // format as YYYY-MM-DD
  };

  const api = {
    tickets: {
      pastDue: useApi.ticket.fetchMany(openPastDueTicketParams),
    },
  };

  const navigate = useNavigate();

  // on row click, navigate to ticket detail page
  const onRow = (record) => {
    return {
      onClick: () => {
        navigate(`/tickets/${record.id}`);
      },
      style: { cursor: 'pointer' },
    };
  };

  const cols = ["Title", "Thing", "Category", "Assigned User"];

  return (
    <Card
      title={`Past Due Tickets (${api.tickets.pastDue.count || 0})`}
      style={{
        width: 600
      }}>
      <Flex vertical flex={1} >
        <Table
          dataSource={api.tickets.pastDue.data || []}
          columns={getColumns(cols)}
          onRow={onRow}
          pagination={false}
          scroll={{ y: 300 }}
          loading={api.tickets.pastDue.loading}
          error={api.tickets.pastDue.error}
          rowKey="id" />
      </Flex>
    </Card>
  );
}

export default PastDueTickets;
