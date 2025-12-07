import { Select } from "antd";
import useApi from "../../api/";

const ThingCategoryDropdown = ({ selectedThingCategoryId, setSelectedThingCategoryId }) => {
  const { data, loading, error, refetch } = useApi.thing.fetchCategories();

  const handleChange = (value) => {
    console.log("value selected in ThingCategoryDropdown:", value);
    setSelectedThingCategoryId(value);
  };

  return (
    <Select
      showSearch
      style={{ width: 200 }}
      placeholder="Select a category"
      optionFilterProp="children"
      error={error}
      onChange={handleChange}
      value={selectedThingCategoryId ? Number(selectedThingCategoryId) : undefined}
      allowClear
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      optionRender={(option) => (
        <div style={{ backgroundColor: option.data.color, padding: '5px 12px' }}>
          {option.data.label}
        </div>
      )}
      options={data ? data.map(thingCategory => ({
        label: thingCategory.name,
        value: thingCategory.id,
        color: thingCategory.color,
      })) : []}
    />
  );
}


export default ThingCategoryDropdown;
