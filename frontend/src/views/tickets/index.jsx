import { Card, Flex, List, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import components from "../../components";
import { useEffect, useState } from "react";
import useApi from "../../api";

const {
  CommentPanel,
  ActionPanel,
  tables: { TicketTable },
  details: { TicketDetails },
  inputs: { MilestoneDropdown }
} = components;

const TicketView = () => {
  const {
    ticketId,
    ticketData,
    ticketLoading,
    ticketError,
    milestonesData,
    milestonesLoading,
    removeMilestone,
    fetchTicket,
    onRow,
    beginAddTicket,
    setBeginAddTicket,
    addMilestone,
    refreshMilestones,
  } = useTicketViewHooks()
  return (<>
    <Flex gap="10px" style={{ overflowY: 'hidden' }}>
      <Flex gap="10px" style={{ height: '100%', minHeight: 0, overflowX: 'auto' }}>
        <TicketTable
          tableMode={ticketId ? "compact" : "full"}
          selectedTicketId={ticketId}
          beginAddTicket={() => setBeginAddTicket(true)}
          scrollHeight={400}
          onRow={onRow} />
        {(ticketId || beginAddTicket) &&
          <Flex vertical>
            <TicketDetails
              addMode={beginAddTicket}
              setAddMode={setBeginAddTicket}
              ticket={beginAddTicket ? {} : ticketData}
              loading={ticketLoading}
              error={ticketError}
              refreshTicket={fetchTicket} />
            <Card
              title="Milestones"
              style={{ width: '300px', height: '100%' }}
              extra={<MilestoneDropdown
                setSelectedMilestoneId={(milestoneId) => addMilestone(ticketId, milestoneId)}
                placeholder="Add" />}
            >
              <List
                loading={milestonesLoading}
                dataSource={milestonesData || []}
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
                        onClick={() => {
                          removeMilestone(ticketId, milestone.id)
                          refreshMilestones();
                        }}
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
            <Flex style={{
              maxHeight: '50%',
              minHeight: '50%'
            }}>
              <CommentPanel ticketId={ticketId} />
            </Flex>
            <Flex style={{
              maxHeight: '50%',
              minHeight: '50%'
            }}>
              <ActionPanel ticketId={ticketId} />
            </Flex>
          </Flex>
        </>}
      </Flex>
    </Flex>
  </>)
}


const useTicketViewHooks = () => {
  // initialize state
  const { ticketId } = useParams();
  const [beginAddTicket, setBeginAddTicket] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // custom hooks
  const {
    data: ticketData,
    loading: ticketLoading,
    error: ticketError,
    getTicket
  } = useApi.ticket.fetchOne(ticketId);
  const {
    data: milestonesData,
    loading: milestonesLoading,
    error: milestonesError,
    fetchData: fetchMilestones
  } = useApi.milestone.fetchMany({ ticket_id: ticketId });
  const refreshMilestones = () => {
    if (ticketId) {
      fetchMilestones({ ticket_id: ticketId });
    }
  }

  const {
    data: createMilestoneData,
    loading: createMilestoneLoading,
    addMilestone
  } = useApi.ticket.addMilestone();
  const {
    data: removeMilestoneData,
    loading: removeMilestoneLoading,
    error: removeMilestoneError,
    removeMilestone
  } = useApi.ticket.removeMilestone();

  // helpers for fetching data
  const refreshTicket = () => {
    if (ticketId) {
      getTicket(ticketId);
    }
  }

  useEffect(() => {
    if (ticketId) {
      refreshTicket()
      refreshMilestones()
    }
  }, [ticketId])

  useEffect(() => {
    if (createMilestoneData) {
      refreshMilestones();
    }
  }, [createMilestoneLoading])

  const selectTicket = (newTicketId) => {
    if (!newTicketId || newTicketId === ticketId) {
      navigate(`/`);
      return;
    }
    navigate(`/tickets/${newTicketId}`);
  }

  const onRow = (record) => {
    return {
      onClick: () => {
        if (record.id != ticketId) {
          navigate(`/tickets/${record.id}`)
        } else {
          navigate(`/tickets/`);
        }
      }
    }
  }

  return {
    ticketId,
    selectTicket,
    onRow,
    ticketData,
    ticketLoading,
    ticketError,
    removeMilestoneData,
    removeMilestoneLoading,
    removeMilestoneError,
    removeMilestone,
    milestonesData,
    milestonesLoading,
    milestonesError,
    location,
    fetchTicket: refreshTicket,
    onRow: onRow,
    beginAddTicket,
    setBeginAddTicket,
    addMilestone,
    refreshMilestones,
  }

}

export default TicketView;
