import { Select } from "antd";
import useApi from "../../api/";

const TicketLinkTypeDropdown = ({ selectedTypeId, setSelectedTypeId }) => {
  const { data, loading, error } = useApi.ticket.links.fetchTypes();

  const handleChange = (value) => {
    console.log("value selected in ActionTepeDropdown:", value);
    setSelectedTypeId(value);
  };

  return (
    <Select
      showSearch
      style={{ width: 250 }}
      placeholder="Select a type"
      optionFilterProp="children"
      error={error}
      loading={loading}
      onChange={handleChange}
      value={selectedTypeId ? Number(selectedTypeId) : undefined}
      allowClear
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      optionRender={(option) => (
        <div style={{ backgroundColor: option.data.color, padding: '5px 12px' }}>
          {option.data.label}
        </div>
      )}
      options={data ? data.map(actionType => ({
        label: actionType.name,
        value: actionType.id,
        color: actionType.color,
      })) : []}
    />
  );
}


export default TicketLinkTypeDropdown;
