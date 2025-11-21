import { Select } from "antd";
import { useEffect } from "react";
import useApi from "../../api/";

const ScheduleDropdown = (
  { selectedScheduleId, setSelectedScheduleId, filters, placeholder = "Select Schedule" }
) => {
  const params = {
    ...filters,
    page_size: filters?.page_size || 10000,
    page_number: 1
  }
  const { data, loading, error, fetchData } = useApi.schedule.fetchMany(params);

  const handleChange = (value) => {
    console.log("value selected in ScheduleDropdown:", value);
    setSelectedScheduleId(value);
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
      value={selectedScheduleId ? Number(selectedScheduleId) : null}
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      options={data ? data.map(schedule => ({
        label: schedule.name,
        value: schedule.id
      })) : []}
    />
  );
}


export default ScheduleDropdown;
