import { Select } from "antd";
import { useEffect } from "react";
import useApi from "../../api/";

const ThingDropdown = ({ selectedThingId, setSelectedThingId, filters }) => {
  const params = {
    ...filters,
    page_size: filters?.page_size || 10000,
    page_number: 1
  }
  const {
    data,
    loading,
    error,
    refetch
  } = useApi.thing.fetchMany(params);
  console.log("data in ThingDropdown:", data);
  console.log("selectedThingId in ThingDropdown:", selectedThingId);

  const handleChange = (value) => {
    console.log("value selected in ThingDropdown:", value);
    setSelectedThingId(value);
  };

  useEffect(() => {
    refetch(params);
  }, [filters]);

  return (
    <Select
      showSearch
      style={{ width: 200 }}
      placeholder="Select a thing"
      optionFilterProp="children"
      error={error}
      onChange={handleChange}
      value={selectedThingId}
      allowClear
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      options={data ? data.map(thing => ({
        label: thing.name,
        value: thing.id
      })) : []}
    />
  );
}


export default ThingDropdown;
