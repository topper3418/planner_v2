import { Select } from "antd";
import { useEffect } from "react";
import useApi from "../../api/";

const ThingDropdown = ({ selectedThingId, setSelectedThingId, filters }) => {
  const { data, loading, error, refetch } = useApi.thing.fetchMany(filters);

  const handleChange = (value) => {
    console.log("value selected in ThingDropdown:", value);
    setSelectedThingId(value);
  };

  useEffect(() => {
    refetch(filters);
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
