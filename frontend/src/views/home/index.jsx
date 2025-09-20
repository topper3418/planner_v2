import { Breadcrumb, Layout, Menu, theme, Typography } from 'antd';

const { Header, Content, Footer } = Layout;

const HomeView = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Typography.Title style={{ color: 'black', margin: 0 }} level={2}>
      Home View
    </Typography.Title>
  );
}


export default HomeView;
