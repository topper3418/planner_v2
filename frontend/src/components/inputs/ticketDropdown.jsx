import { Select } from "antd";
import { useEffect } from "react";
import useApi from "../../api/";

const TicketDropdown = ({ selectedTicketId, setSelectedTicketId, filters }) => {
  const { data, loading, error, refetch } = useApi.ticket.fetchMany(filters);
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
