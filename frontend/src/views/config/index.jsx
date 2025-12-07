import { Button, Flex, Select, Typography } from "antd";
import useCategoryViewHooks from "./hooks";
import components from "../../components";
import CategoryTypeDropdown from "./categoryTypeDropdown";

const {
  tables: { CategoryTable },
  modals: { CategoryModal }
} = components;

const ConfigView = () => {
  const {
    categoryName,
    setCategoryName,
    api,
    modalControl,
  } = useCategoryViewHooks();
  return (<>
    <Flex vertical gap="10px">
      <Flex justify="space-between">
        <CategoryTypeDropdown
          selectedType={categoryName}
          onTypeChange={setCategoryName} />
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
      <Flex gap="10px" style={{ flexWrap: 'wrap' }}>
        <CategoryTable
          api={api}
          categoryName={categoryName}
          modalControl={modalControl}
        />
      </Flex>
    </Flex>
    <CategoryModal
      modalControl={modalControl} />
  </>)
}


export default ConfigView;
