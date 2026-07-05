import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CalendarDay from './calendarDay';

const mockNavigate = vi.fn();
let mockTodos = [];
let mockCompletions = [];

vi.mock('../../navigation', () => ({
  default: () => ({
    navigate: mockNavigate,
    searchParams: new URLSearchParams(),
    location: { pathname: '/calendar' },
  }),
}));

vi.mock('../../api', () => ({
  default: {
    ticket: {
      fetchTodos: () => ({
        data: mockTodos,
        fetchData: vi.fn(),
      }),
      create: () => ({}),
    },
    action: {
      fetchMany: () => ({
        data: mockCompletions,
        fetchData: vi.fn(),
      }),
    },
  },
}));

vi.mock('../../components', () => ({
  default: {
    modals: {
      TicketModal: () => null,
      controllers: {
        useTicketModalControl: () => ({
          add: { open: vi.fn() },
        }),
      },
    },
  },
}));

const renderCalendarDay = ({
  dayDate = new Date('2026-07-14T00:00:00.000Z'),
  currentDate = new Date('2026-07-09T15:00:00.000Z'),
} = {}) => render(
  <MemoryRouter basename="/apps/planner-v2" initialEntries={['/apps/planner-v2/calendar']}>
    <Routes>
      <Route
        path="/calendar"
        element={(
          <CalendarDay
            dayDate={dayDate}
            month={dayDate.getMonth()}
            currentDate={currentDate}
          />
        )}
      />
    </Routes>
  </MemoryRouter>,
);

describe('CalendarDay', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockTodos = [];
    mockCompletions = [];
  });

  it('navigates through React Router when a calendar ticket is clicked', () => {
    mockTodos = [{
      id: 42,
      title: 'Fix leak',
      open: true,
      created_at: '2020-01-01T00:00:00.000Z',
      schedule_id: null,
    }];

    renderCalendarDay({
      dayDate: new Date('2026-07-05T12:00:00.000Z'),
      currentDate: new Date('2026-07-05T00:00:00.000Z'),
    });

    fireEvent.click(screen.getByText('Fix leak'));

    expect(mockNavigate).toHaveBeenCalledWith('/tickets/42');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('renders closed scheduled tickets on future days from the API', () => {
    mockTodos = [{
      id: 7,
      title: 'Run Pool Robot',
      open: false,
      created_at: '2026-01-01T00:00:00.000Z',
      schedule_id: 4,
      category: { color: '#336699' },
    }];

    renderCalendarDay();

    const ticket = screen.getByText('Run Pool Robot');
    expect(ticket).toBeInTheDocument();
    expect(ticket).toHaveStyle({ opacity: '0.45' });
  });

  it('renders reopened scheduled tickets at full opacity', () => {
    mockTodos = [{
      id: 7,
      title: 'Run Pool Robot',
      open: true,
      created_at: '2026-01-01T00:00:00.000Z',
      schedule_id: 4,
      category: { color: '#336699' },
    }];

    renderCalendarDay({
      dayDate: new Date('2026-07-08T00:00:00.000Z'),
      currentDate: new Date('2026-07-09T15:00:00.000Z'),
    });

    const ticket = screen.getByText('Run Pool Robot');
    expect(ticket).toHaveStyle({ opacity: '1' });
  });

  it('does not render closed non-scheduled tickets', () => {
    mockTodos = [{
      id: 8,
      title: 'One-off done',
      open: false,
      created_at: '2026-01-01T00:00:00.000Z',
      schedule_id: null,
    }];

    renderCalendarDay();

    expect(screen.queryByText('One-off done')).not.toBeInTheDocument();
  });
});