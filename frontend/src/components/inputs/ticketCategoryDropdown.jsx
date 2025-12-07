import { Select } from "antd";
import useApi from "../../api/";

const TicketCategoryDropdown = ({ selectedCategoryId, setSelectedCategoryId }) => {
  const { data, loading, error } = useApi.ticket.fetchCategories();

  const handleChange = (value) => {
    console.log("value selected in TicketCategoryDropdown:", value);
    setSelectedCategoryId(value);
  };

  return (
    <Select
      showSearch
      loading={loading}
      style={{ width: 200 }}
      placeholder="Select a category"
      optionFilterProp="children"
      error={error}
      onChange={handleChange}
      value={selectedCategoryId ? Number(selectedCategoryId) : undefined}
      allowClear
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      optionRender={(option) => (
        <div style={{ backgroundColor: option.data.color, padding: '5px 12px' }}>
          {option.data.label}
        </div>
      )}
      options={data ? data.map(ticketCategory => ({
        label: ticketCategory.name,
        value: ticketCategory.id,
        color: ticketCategory.color,
      })) : []}
    />
  );
}


export default TicketCategoryDropdown;
