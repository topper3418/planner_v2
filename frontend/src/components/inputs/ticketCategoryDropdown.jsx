import { Select } from "antd";
import { useEffect } from "react";
import useApi from "../../api/";

const TicketCategoryDropdown = ({ selectedCategoryId, setSelectedCategoryId }) => {
  const { data, loading, error, refetch } = useApi.ticket.fetchCategories();

  const handleChange = (value) => {
    console.log("value selected in TicketCategoryDropdown:", value);
    setSelectedCategoryId(value);
  };

  return (
    <Select
      showSearch
      style={{ width: 200 }}
      placeholder="Select a category"
      optionFilterProp="children"
      error={error}
      onChange={handleChange}
      value={selectedCategoryId}
      allowClear
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      options={data ? data.map(ticketCategory => ({
        label: ticketCategory.name,
        value: ticketCategory.id
      })) : []}
    />
  );
}


export default TicketCategoryDropdown;
