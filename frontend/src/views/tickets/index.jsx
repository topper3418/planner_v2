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
  const cols = ticketId ? ["Title", "Thing", "Category", "Due Date"] :
    ["Title", "Thing", "Category", "Assigned User", "Due Date"];
  return (<>
    <Flex gap="10px" style={{
      height: '100%',
      overflowY: 'hidden',
    }}>
      <Flex gap="10px" style={{
        height: '100%',
        overflowX: 'auto',
        flexWrap: 'wrap',
      }}>
        <TicketTable
          ticketListApi={api.ticket.list}
          tableMode={ticketId ? "compact" : "full"}
          widthOverride={ticketId ? 600 : 1100}
          colsOverride={cols}
          selectedTicketId={ticketId}
          beginAddTicket={modalControl.add.open}
          scrollHeight={500}
          onRow={(record) => {
            return {
              onClick: () => select.ticket(record.id)
            }
          }} />
        {ticketId &&
          <Flex vertical gap="10px" style={{ height: 'calc(100% - 20px)' }}>
            <TicketDetails
              ticket={api.ticket.selected.data}
              loading={api.ticket.selected.loading}
              error={api.ticket.selected.error}
              beginEdit={modalControl.edit.open}
              height="60%"
            />
            <Card
              title="Milestones"
              style={{ width: '300px', height: '40%' }}
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
    </Flex>
    <TicketModal
      modalControl={modalControl} />
  </>)
}

export default TicketView;
