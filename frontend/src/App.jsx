import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ConfigProvider, Flex, Layout, theme } from 'antd';

import TicketView from './views/tickets';
import ThingView from './views/things';
import MilestoneView from './views/milestones';
import ScheduleView from './views/schedules';
import UserView from './views/users';
import HomeView from './views/home';
import ConfigView from './views/config';
import DueTicketsCalendar from './views/calendar';

import PlannerTitle from './components/plannerTitle';
import Filters from './components/filters';


const { Header, Content } = Layout;

const App = () => {
  const isDev = process.env.NODE_ENV == "development"

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <BrowserRouter>
        <Layout style={{
          height: '100vh',
          width: '100vw',
          paddingLeft: '0'
        }}>
          <Header style={{
            paddingLeft: '20px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <PlannerTitle />
            {isDev &&
              <div style={{ marginLeft: '20px', color: 'orange' }}>
                Development Mode
              </div>
            }
            <Filters />
          </Header>
          <Content style={{
            height: 'calc(100vh - 64px)',
            overflow: 'auto',
            padding: '10px'
          }}>
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/calendar" element={<DueTicketsCalendar />} />
              <Route path="/tickets/" element={<TicketView />} />
              <Route path="/tickets/:ticketId" element={<TicketView />} />
              <Route path="/things/" element={<ThingView />} />
              <Route path="/things/:thingId" element={<ThingView />} />
              <Route path="/things/:thingId/tickets/:ticketId" element={<ThingView />} />
              {/* <Route path="/milestones" element={<MilestoneView />} /> */}
              {/* <Route path="/milestones/:milestoneId" element={<MilestoneView />} /> */}
              <Route path="/schedules" element={<ScheduleView />} />
              <Route path="/schedules/:scheduleId" element={<ScheduleView />} />
              <Route path="/users" element={<UserView />} />
              <Route path="/users/:userId" element={<UserView />} />
              <Route path="/config" element={<ConfigView />} />
            </Routes>
          </Content>
        </Layout>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App
