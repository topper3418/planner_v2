import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Flex, Layout, Typography } from 'antd';

const { Header, Content } = Layout;
import ThingsView from './views/things'
import HomeView from './views/home'
import NavBar from './components/navbar';

const App = () => {

  return (
    <BrowserRouter>
      <Flex style={{ width: "100vw" }}>
        <Layout style={{ minHeight: '100vh' }}>
          <Header style={{ display: 'flex', alignItems: 'center' }}>
            <Typography.Title style={{ color: 'white', margin: 0, marginRight: '25px' }} level={3}>
              Planner
            </Typography.Title>
            <NavBar />
          </Header>
          <Content style={{ padding: '0 48px' }}>
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/things" element={<ThingsView />} />
            </Routes>
          </Content>
        </Layout>
      </Flex>
    </BrowserRouter>
  );
}

export default App
