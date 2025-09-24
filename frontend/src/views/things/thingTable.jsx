import { useEffect } from "react";
import { Table, Tooltip, message } from "antd";
import { useThingView } from "./hooks";



const ThingTable = ({ filters }) => {
  const { data, loading, error, refetch } = useThingView()
  useEffect(() => {
    refetch(filters)
  }, [filters])
  useEffect(() => {
    if (error) {
      const messageStr = `Error fetching data: ${error.message || error}`
      console.error(messageStr, error)
      message.error(messageStr)
    }
  }, [error])
  return (
    <Table
      dataSource={data ? data : []}
      columns={columns}
      loading={loading}
      onRow={(record) => ({
        // Pass custom props to the row
        "data-description": record.description || "No description",
      })}
      components={{
        body: {
          row: (props) => (
            <Tooltip title={props?.['data-description'] || "No description"}>
              <tr {...props} />
            </Tooltip>
          )
        }
      }}
      rowKey="id" />
  )
}

const CustomRow = (props) => {
  console.log("Row props", props)
  return (
    <Tooltip title={props?.['data-description'] || "No description"}>
      <tr {...props} />
    </Tooltip>
  );
}


const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Category',
    dataIndex: 'category_name',
    key: 'category_name',
  },
]


export default ThingTable;
