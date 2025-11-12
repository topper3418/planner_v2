import { Select } from "antd";
import { useEffect } from "react";
import useApi from "../../api/";

const MilestoneDropdown = (
  { selectedMilestoneId, setSelectedMilestoneId, filters, placeholder = "Select Milestone" }
) => {
  const params = {
    ...filters,
    page_size: filters?.page_size || 10000,
    page_number: 1
  }
  const { data, loading, error, fetchData } = useApi.milestone.fetchMany(params);

  const handleChange = (value) => {
    console.log("value selected in MilestoneDropdown:", value);
    setSelectedMilestoneId(value);
  };

  useEffect(() => {
    fetchData(params);
  }, [filters]);

  return (
    <Select
      showSearch
      style={{ width: "150px" }}
      placeholder={placeholder}
      allowClear
      error={error}
      onChange={handleChange}
      value={selectedMilestoneId}
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      options={data ? data.map(milestone => ({
        label: milestone.name,
        value: milestone.id
      })) : []}
    />
  );
}


export default MilestoneDropdown;
