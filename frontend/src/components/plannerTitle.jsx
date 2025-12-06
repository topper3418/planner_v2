import { Dropdown, Typography } from "antd";
import { useNavBarProps } from "./navbar";
import useViewNavigation from "../navigation";

const PlannerTitle = () => {
  const navigation = useViewNavigation();
  const navBarProps = useNavBarProps();

  const pageName = navigation.location.pathname.split('/')[1] || 'home';

  return (
    <Dropdown
      menu={navBarProps}
      placement="bottomLeft"
      trigger={['click', 'hover']}>
      <Typography.Title
        style={{
          color: 'white',
          margin: 0,
          marginRight: '25px',
          cursor: 'pointer',
        }}
        level={3}
      >
        {"Planner - " + pageName.charAt(0).toUpperCase() + pageName.slice(1)}
      </Typography.Title>
    </Dropdown>
  )
}

export default PlannerTitle;
