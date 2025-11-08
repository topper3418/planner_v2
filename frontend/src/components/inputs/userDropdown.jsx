import { Select } from "antd";
import { useEffect } from "react";
import useApi from "../../api/";

const UserDropdown = (
  { selectedUserId, setSelectedUserId, filters, placeholder = "Select User" }
) => {
  const { data, loading, error, fetchData } = useApi.user.fetchMany(filters);

  const handleChange = (value) => {
    console.log("value selected in UserDropdown:", value);
    setSelectedUserId(value);
  };

  useEffect(() => {
    fetchData(filters);
  }, [filters]);

  return (
    <Select
      showSearch
      style={{ width: "150px" }}
      placeholder={placeholder}
      allowClear
      error={error}
      onChange={handleChange}
      value={selectedUserId}
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      options={data ? data.map(user => ({
        label: user.username,
        value: user.id
      })) : []}
    />
  );
}


export default UserDropdown;
