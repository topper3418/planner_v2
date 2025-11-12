import { Button, Card, Descriptions, Flex } from "antd"


const ThingDetails = (
  { thing, loading, error, beginEdit }
) => {
  return (
    <Card
      title="Thing"
      loading={loading}
      error={error}
      extra={
        <Button
          type="primary"
          onClick={beginEdit} >Edit</Button>
      }
      style={{
        padding: '10px',
        width: '250px',
      }}
    >
      <Flex vertical>
        <Descriptions
          column={1}
          error={error}
          size="small">
          <Descriptions.Item label="Name">
            {thing?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Docs Link">
            {thing?.docs_link ?
              <a
                href={thing?.docs_link}
                target="_blank"
                rel="noopener noreferrer">
                {thing?.docs_link}
              </a> :
              'No link'}
          </Descriptions.Item>
          <Descriptions.Item label="category">
            {thing?.category ? thing.category.name : 'Uncategorized'}
          </Descriptions.Item>
          <Descriptions.Item label="Parent">
            {thing?.parent ? thing.parent.name : 'No parent'}
          </Descriptions.Item>
          <Descriptions.Item label="Description">
            {thing?.description ? thing.description : 'No description'}
          </Descriptions.Item>
        </Descriptions>
      </Flex>
    </Card>
  )
}


export default ThingDetails;
