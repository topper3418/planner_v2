import { Card, Flex, List, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import components from "../../components";
import useTicketViewHooks from "./hooks";

const {
  ActionPanel,
  tables: { TicketTable },
  details: { TicketDetails },
  modals: { TicketModal },
  inputs: { MilestoneDropdown }
} = components;

const TicketView = () => {
  const {
    ticketId,
    select,
    api,
    modalControl
  } = useTicketViewHooks()
  return (<>
    <Flex gap="10px" style={{
      height: '100%',
      overflowX: 'auto',
      flexWrap: 'wrap'
    }}>
      <TicketTable
        tableMode={ticketId ? "compact" : "full"}
        selectedTicketId={ticketId}
        beginAddTicket={modalControl.add.open}
        scrollHeight={500}
        onRow={(record) => {
          return {
            onClick: () => select.ticket(record.id)
          }
        }} />
      {ticketId &&
        <Flex vertical gap="10px">
          <TicketDetails
            ticket={api.ticket.selected.data}
            loading={api.ticket.selected.loading}
            error={api.ticket.selected.error}
            beginEdit={modalControl.edit.open} />
          <Card
            title="Milestones"
            style={{ width: '250px', height: '100%' }}
            extra={<MilestoneDropdown
              setSelectedMilestoneId={(milestoneId) => api.ticket.addMilestone.addMilestone(ticketId, milestoneId)}
              placeholder="Add" />}
          >
            <List
              loading={api.milestone.list.loading}
              dataSource={api.milestone.list.data || []}
              renderItem={(milestone) => (
                <List.Item
                  style={{
                    padding: '10px',
                  }}
                >
                  <Flex justify="space-between" style={{ width: '100%' }}>
                    {milestone.name}
                    <Button
                      icon={<DeleteOutlined />}
                      onClick={() =>
                        api.ticket.removeMilestone.removeMilestone(ticketId, milestone.id)}
                    />
                  </Flex>
                </List.Item>
              )}
            />
          </Card>
        </Flex>}
      {ticketId && <>
        <Flex
          vertical
          gap="10px"
          style={{ flex: 1, height: "100%" }}>
          <ActionPanel ticketId={ticketId} refreshAll={api.refreshAll} />
        </Flex>
      </>}
    </Flex>
    <TicketModal
      modalControl={modalControl} />
  </>)
}

export default TicketView;
