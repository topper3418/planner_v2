import { Select } from "antd";
import useApi from "../../api/";

const ActionTypeDropdown = ({ selectedActionTypeId, setSelectedActionTypeId }) => {
  const { data, loading, error } = useApi.action.fetchTypes();

  const handleChange = (value) => {
    console.log("value selected in ActionTepeDropdown:", value);
    setSelectedActionTypeId(value);
  };

  return (
    <Select
      showSearch
      style={{ width: 150 }}
      placeholder="Select a type"
      optionFilterProp="children"
      error={error}
      loading={loading}
      onChange={handleChange}
      value={selectedActionTypeId ? Number(selectedActionTypeId) : undefined}
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


export default ActionTypeDropdown;
