import { Button, Card, Flex, Input, Table } from "antd";
import useApi from "../api";
import { useState } from "react";
import ActionTypeDropdown from "./inputs/actionTypeDropdown";
import { formatDate } from "../util/formatting";


const ActionPanel = ({ ticketId }) => {
  const { data, loading, error, refetch } = useApi.action.fetchMany({ ticket_id: ticketId });
  const [newActionText, setNewActionText] = useState("");
  const [newActionTypeId, setNewActionTypeId] = useState(null);

  return (
    <Card title="Actions" style={{ height: '325px' }}>
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
                dataIndex: 'created_at',
                key: 'created_at',
                render: formatDate
              },
              {
                title: 'Type',
                dataIndex: 'type',
                key: 'type',
              },
              {
                title: 'Action',
                dataIndex: 'content',
                key: 'content',
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
              style={{ marginTop: '10px' }}
              onClick={async () => {
                if (newActionText.trim() === "") return;
                await useApi.action.create({ ticket_id: ticketId, content: newActionText });
                setNewActionText("");
                refetch({ ticket_id: ticketId });
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
