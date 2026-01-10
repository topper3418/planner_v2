import { Button, Card, Flex, Input, Select, Table, Typography } from "antd";
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
  const [selectedActionType, setSelectedActionType] = useState(null);
  const [filteredActions, setFilteredActions] = useState([]);
  const {
    data,
    loading,
    error,
    fetchData
  } = useApi.action.fetchMany(fetchParams);
  const {
    data: createData,
    loading: createLoading,
    error: createError,
    create: createAction
  } = useApi.action.create();

  useEffect(() => {
    fetchData(fetchParams);
  }, [ticketId]);

  const [newActionText, setNewActionText] = useState("");
  const [newActionTypeId, setNewActionTypeId] = useState(null);

  const allActionTypes = data?.reduce((types, action) => {
    if (action.action_type && !types.find(t => t.id === action.action_type.id)) {
      types.push(action.action_type);
    }
    return types;
  }, []);

  useEffect(() => {
    let filtered = data || [];
    if (data) {
      if (selectedActionType) {
        filtered = data.filter(action => action.action_type && action.action_type.id === selectedActionType);
      }
    }
    //reverse it to show latest first
    setFilteredActions(filtered.slice().sort((a, b) => new Date(b.performed_at) - new Date(a.performed_at)));
  }, [data, selectedActionType]);

  return (
    <Card
      title="Actions"
      style={{ width: '450px', height: "100%" }}
      extra={<Select
        style={{ width: 150 }}
        placeholder="Type"
        allowClear
        onChange={(value) => {
          setSelectedActionType(value);
        }}
        options={allActionTypes?.map(type => ({
          label: type.name,
          value: type.id
        }))} />}
    >
      <Flex vertical justify="space-between" style={{ height: "100%" }}>
        <Flex gap="10px" style={{ padding: "10px", borderBottom: "1px solid #f0f0f0" }}>
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
                fetchData(fetchParams);
                refreshAll();
              }} >
              Add Action
            </Button>
            <ActionTypeDropdown
              selectedActionTypeId={newActionTypeId}
              setSelectedActionTypeId={setNewActionTypeId} />
          </Flex>
        </Flex>
        <Flex vertical style={{ paddingTop: "10px", overflowY: 'auto', flex: 1, height: "100%" }}>
          <Table
            showHeader={false}
            dataSource={filteredActions}
            loading={loading}
            columns={[
              {
                title: 'Time',
                dataIndex: 'performed_at',
                width: 120,
                key: 'performed_at',
                render: (text, record) => {
                  return (
                    <Flex vertical align="center">
                      <Typography.Text style={{ textAlign: 'center' }}>
                        {formatDate(text)}
                      </Typography.Text>
                      <span
                        style={{
                          backgroundColor: record.action_type.color,
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                        {record.action_type.name}
                      </span>
                    </Flex>
                  )
                }
              },
              {
                title: 'Action',
                dataIndex: 'action_text',
                key: 'action_text',
              },
            ]}
            scroll={{ y: 460 }}
            pagination={false} />
        </Flex>
      </Flex>
    </Card >
  )
}


export default ActionPanel;
