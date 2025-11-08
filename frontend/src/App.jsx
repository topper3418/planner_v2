import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Flex, Layout } from 'antd';

const { Header, Content } = Layout;
import components from './components';
import NavBar from './components/navBar';
import TicketView from './views/tickets';
import ThingView from './views/things';
import MilestoneView from './views/milestones';
import UserView from './views/users';

const { PlannerTitle } = components;

const App = () => {

  return (
    <BrowserRouter>
      <Flex style={{ width: "100vw" }}>
        <Layout style={{
          minHeight: '100vh',
          paddingLeft: '0'
        }}>
          <Header style={{
            paddingLeft: '20px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <PlannerTitle />
            <NavBar />
          </Header>
          <Content style={{
            height: 'calc(100vh - 64px)',
            overflow: 'auto',
            padding: '10px'
          }}>
            <Routes>
              <Route path="/" element={<ThingView />} />
              <Route path="/tickets/" element={<TicketView />} />
              <Route path="/tickets/:ticketId" element={<TicketView />} />
              <Route path="/things/:thingId" element={<ThingView />} />
              <Route path="/things/:thingId/tickets/:ticketId" element={<ThingView />} />
              <Route path="/milestones" element={<MilestoneView />} />
              <Route path="/milestones/:milestoneId" element={<MilestoneView />} />
              <Route path="/users" element={<UserView />} />
              <Route path="/users/:userId" element={<UserView />} />
            </Routes>
          </Content>
        </Layout>
      </Flex>
    </BrowserRouter>
  );
}

export default App
