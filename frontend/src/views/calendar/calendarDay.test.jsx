import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CalendarDay from './calendarDay';

const mockNavigate = vi.fn();

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
        data: [{
          id: 42,
          title: 'Fix leak',
          open: true,
          created_at: '2020-01-01T00:00:00.000Z',
          schedule_id: null,
        }],
        fetchData: vi.fn(),
      }),
      create: () => ({}),
    },
    action: {
      fetchMany: () => ({
        data: [],
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

describe('CalendarDay ticket navigation', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it('navigates through React Router when a calendar ticket is clicked', () => {
    const dayDate = new Date('2026-07-05T12:00:00.000Z');
    const currentDate = new Date('2026-07-05T00:00:00.000Z');

    render(
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

    fireEvent.click(screen.getByText('Fix leak'));

    expect(mockNavigate).toHaveBeenCalledWith('/tickets/42');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});