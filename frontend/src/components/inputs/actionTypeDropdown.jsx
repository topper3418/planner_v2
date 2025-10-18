import { Select } from "antd";
import { useEffect } from "react";
import useApi from "../../api/";

const ActionTypeDropdown = ({ selectedActionTypeId, setSelectedActionTypeId }) => {
  const { data, loading, error, refetch } = useApi.action.fetchMany();

  const handleChange = (value) => {
    console.log("value selected in ActionTepeDropdown:", value);
    setSelectedActionTypeId(value);
  };

  return (
    <Select
      showSearch
      style={{ width: 200 }}
      placeholder="Select a type"
      optionFilterProp="children"
      error={error}
      onChange={handleChange}
      value={selectedActionTypeId}
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


export default ActionTypeDropdown;
