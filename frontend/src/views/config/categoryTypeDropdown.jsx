import { Select } from "antd";


const CategoryTypeDropdown = ({ selectedType, onTypeChange }) => {
  return (
    <Select
      value={selectedType}
      onChange={onTypeChange}
      style={{ width: '200px' }}
      options={[
        { label: 'Action Types', value: 'actionType' },
        { label: 'Ticket Categories', value: 'ticketCategory' },
        { label: 'Thing Categories', value: 'thingCategory' },
      ]} />
  )
}

export default CategoryTypeDropdown;
