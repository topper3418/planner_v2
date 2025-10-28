import { Typography } from "antd";
import { useNavigate } from "react-router-dom";

const PlannerTitle = () => {
  const navigate = useNavigate();
  return (
    <Typography.Title
      style={{
        color: 'white',
        margin: 0,
        marginRight: '25px',
        cursor: 'pointer',
      }}
      level={3}
      onClick={() => navigate('/')}
    >
      Planner
    </Typography.Title>
  )
}

export default PlannerTitle;
