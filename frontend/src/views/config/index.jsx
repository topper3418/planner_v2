import { Button, Flex, Typography } from "antd";


const ConfigView = () => {
  return (
    <Flex justify="right">
      <Button
        href="https://github.com/topper3418/planner_v2/issues"
        target="_blank"
        type="primary"
      >
        <Typography.Text>
          Go to Github Issues
        </Typography.Text>
      </Button>
    </Flex>
  )
}


export default ConfigView;
