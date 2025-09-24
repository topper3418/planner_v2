import { useState } from "react";
import { Flex, Typography } from "antd";
import ThingTable from "./thingTable";



const ThingsView = () => {
  const [filters, setFilters] = useState({})
  return (
    <Flex vertical padding={10} gap={10}>
      <Typography.Title level={2}>Things View</Typography.Title>
      <ThingTable />
    </Flex>
  )
}

export default ThingsView;
