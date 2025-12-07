import { Button, Card, Flex, Input, Table } from "antd";
import useApi from "../api";
import { useEffect, useState } from "react";
import ActionTypeDropdown from "./inputs/actionTypeDropdown";
import { formatDate } from "../util/formatting";


const ActionPanel = ({ ticketId, refreshAll }) => {
  const fetchParams = {
    ticket_id: ticketId,
    include: 'action_type',
    page_size: 10000
  };
  const {
    data,
    loading,
    error,
    refetch
  } = useApi.action.fetchMany(fetchParams);
  const {
    data: createData,
    loading: createLoading,
    error: createError,
    create: createAction
  } = useApi.action.create();

  useEffect(() => {
    refetch(fetchParams);
  }, [ticketId]);

  const [newActionText, setNewActionText] = useState("");
  const [newActionTypeId, setNewActionTypeId] = useState(null);

  return (
    <Card title="Actions" style={{ height: '325px', width: '450px' }}>
      <Flex vertical justify="space-between">
        <Flex vertical style={{ overflowY: 'auto', flex: 1 }}>
          <Table
            showHeader={false}
            dataSource={data}
            loading={loading}
            scroll={{ y: 150 }}
            columns={[
              {
                title: 'Time',
                dataIndex: 'performed_at',
                key: 'performed_at',
                render: formatDate
              },
              {
                title: 'Type',
                dataIndex: ['action_type', 'name'],
                key: 'action_type',
                render: (text, record) => {
                  return (
                    <span style={{ backgroundColor: record.action_type.color, padding: '2px 6px', borderRadius: '4px' }}>
                      {text}
                    </span>
                  )
                }
              },
              {
                title: 'Action',
                dataIndex: 'action_text',
                key: 'action_text',
              },
            ]}
            pagination={false} />
        </Flex>
        <Flex gap="10px">
          <Input.TextArea
            value={newActionText}
            onChange={(e) => setNewActionText(e.target.value)}
            placeholder="Add a action..."
            rows={3}
            style={{ marginTop: '10px', marginRight: '10px', flex: 1 }} />
          <Flex vertical gap="10px">
            <Button
              type="primary"
              loading={createLoading}
              error={createError}
              disabled={newActionText.trim() === "" || newActionTypeId === null}
              style={{ marginTop: '10px' }}
              onClick={async () => {
                if (newActionText.trim() === "") return;
                await createAction({ ticket_id: Number(ticketId), action_text: newActionText, action_type_id: newActionTypeId });
                setNewActionText("");
                refetch(fetchParams);
                refreshAll();
              }} >
              Add Action
            </Button>
            <ActionTypeDropdown
              selectedActionTypeId={newActionTypeId}
              setSelectedActionTypeId={setNewActionTypeId} />
          </Flex>
        </Flex>
      </Flex>
    </Card>
  )
}


export default ActionPanel;
