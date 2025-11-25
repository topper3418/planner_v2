import { Select } from "antd";
import { useEffect } from "react";
import useApi from "../../api/";

const UserMultiDropdown = (
  { selectedUserIds, setSelectedUserIds, filters, placeholder = "Select Users" }
) => {
  const {
    data,
    loading,
    error,
    fetchData
  } = useApi.user.fetchMany({
    ...filters,
    page_size: filters?.page_size || 10000,
    page_number: 1
  });

  const handleChange = (value) => {
    console.log("value selected in UserDropdown:", value);
    setSelectedUserIds(value);
  };

  useEffect(() => {
    fetchData(filters);
  }, [filters]);

  const getValue = () => {
    console.log("getting value for UserMultiDropdown:", selectedUserIds);
    let value;
    if (!selectedUserIds) {
      value = [];
    } else {
      console.log("pre-split value:", selectedUserIds);
      console.log("unpacked value:", selectedUserIds[0])
      value = selectedUserIds?.[0]?.split(',')?.map(id => Number(id));
    }
    console.log("value for UserMultiDropdown:", value);
    return value;
  }

  return (
    <Select
      showSearch
      mode="multiple"
      style={{ width: "150px" }}
      placeholder={placeholder}
      allowClear
      onClear={() => handleChange(null)}
      error={error}
      onChange={handleChange}
      value={getValue()}
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      options={data ? [...data, { username: "No User", id: 0 }].map(user => ({
        label: user.username,
        value: user.id
      })) : []}
    />
  );
}


export default UserMultiDropdown;
