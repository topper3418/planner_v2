import { Button, Card, Flex, Input, Table } from "antd";
import useApi from "../api";
import { useState } from "react";
import ActionTypeDropdown from "./inputs/actionTypeDropdown";
import { formatDate } from "../util/formatting";


const ActionPanel = ({ ticketId }) => {
  const fetchParams = {
    ticket_id: ticketId,
    include: 'action_type'
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
              style={{ marginTop: '10px' }}
              onClick={async () => {
                if (newActionText.trim() === "") return;
                await createAction({ ticket_id: ticketId, action_text: newActionText, action_type_id: newActionTypeId });
                setNewActionText("");
                refetch(fetchParams);
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
