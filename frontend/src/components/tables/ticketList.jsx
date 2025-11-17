import { Card, Flex, List } from "antd";

const TicketList = ({ tickets, ticketsLoading, selectTicket }) => {
  return (
    <Card title="Tickets"
      style={{ width: "300px", height: '100%' }}>
      <Flex vertical style={{ overflowY: 'auto', height: '550px' }}>
        <List
          loading={ticketsLoading}
          dataSource={tickets || []}
          renderItem={(ticket) => (
            <List.Item
              style={{
                cursor: 'pointer',
                padding: '10px',
              }}
              onClick={() => selectTicket(ticket.id)}
            >
              {ticket.title}
            </List.Item>
          )} />
      </Flex>
    </Card>
  )
}

export default TicketList;
