import { Select } from "antd";
import { useEffect } from "react";
import useFetchTickets from "../api/";

const TicketDropdown = ({ selectedTicketId, setSelectedTicketId, filters }) => {
  const { data, loading, error, refetch } = useFetchTickets(filters);
  const handleChange = (value) => {
    setSelectedTicketId(value);
  };
  useEffect(() => {
    refetch(filters);
  }, [filters]);
  return (
    <Select
      showSearch
      style={{ width: 200 }}
      placeholder="Select a ticket"
      optionFilterProp="children"
      error={error}
      onChange={handleChange}
      loading={loading}
      value={selectedTicketId}
      allowClear
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      options={data ? data.map(ticket => ({
        label: `${ticket.title} (ID: ${ticket.id})`,
        value: ticket.id
      })) : []}
    />
  );
}


export default TicketDropdown;
