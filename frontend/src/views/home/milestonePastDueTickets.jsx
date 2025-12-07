import { Card, Flex, Table } from 'antd';
import useApi from '../../api';
import { useEffect, useState } from 'react';
import getColumns from '../../tableColumns/getTicketTableColumns';
import { useNavigate } from 'react-router-dom';

const MilestonePastDueTickets = () => {
  const [milestoneIds, setMilestoneIds] = useState([]);

  const pastDueMilestoneParams = {
    due_date_before: new Date().toISOString(),
  }

  const openPastDueTicketParams = {
    open: true,
    milestone_ids: [], // to be filled after fetching past due milestones
    include: ['thing', 'user', 'category'],
    page_size: 10000,
  };

  const api = {
    milestones: {
      list: useApi.milestone.fetchMany(pastDueMilestoneParams),
    },
    tickets: {
      pastDue: useApi.ticket.fetchMany(openPastDueTicketParams, { lazy: true }),
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

  useEffect(() => {
    if (api.milestones.list.data) {
      setMilestoneIds(
        api.milestones.list.data.map((m) => m.id),
      );
    }
  }, [api.milestones.list.loading]);

  useEffect(() => {
    if (milestoneIds.length > 0) {
      api.tickets.pastDue.fetchData({
        ...openPastDueTicketParams,
        milestone_ids: milestoneIds,
      });
    }
  }, [milestoneIds]);

  const cols = ["Title", "Thing", "Category", "Assigned User"];

  return (
    <Card
      title={`Open Tickets on Past Due Milestones (${api.tickets.pastDue.count || 0})`}
      style={{
        width: 500
      }}>
      <Flex vertical flex={1} >
        <Table
          dataSource={api.tickets.pastDue.data ? api.tickets.pastDue.data : []}
          columns={getColumns(cols)}
          onRow={onRow}
          pagination={false}
          scroll={{ y: 400 }}
          loading={api.tickets.pastDue.loading}
          error={api.tickets.pastDue.error}
          rowKey="id" />
      </Flex>
    </Card>
  );
}

export default MilestonePastDueTickets;
