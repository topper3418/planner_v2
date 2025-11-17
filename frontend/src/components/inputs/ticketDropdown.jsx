import { Select } from "antd";
import { useEffect } from "react";
import useApi from "../../api/";

const TicketDropdown = ({ selectedTicketId, setSelectedTicketId, filters }) => {
  const params = {
    ...filters,
    page_size: filters?.page_size || 10000,
    page_number: 1
  }
  const { data, loading, error, refetch } = useApi.ticket.fetchMany(params);
  const handleChange = (value) => {
    setSelectedTicketId(value);
  };
  useEffect(() => {
    refetch(params);
  }, [filters]);
  return (
    <Select
      showSearch
      style={{ width: 200 }}
      placeholder="Select a ticket"
      optionFilterProp="children"
      error={error}
      onChange={handleChange}
      value={selectedTicketId ? Number(selectedTicketId) : undefined}
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
