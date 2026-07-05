import { describe, expect, it } from 'vitest';
import {
  filterCalendarTickets,
  getTicketChipStyle,
  isDayInFuture,
  isScheduledTicket,
  startOfDay,
} from './calendarTicketUtils';

const dayEnd = new Date('2026-07-10T23:59:59.999Z');
const currentDate = new Date('2026-07-09T15:00:00.000Z');

describe('startOfDay', () => {
  it('normalizes a datetime to local midnight', () => {
    const result = startOfDay(new Date('2026-07-09T18:30:00.000Z'));
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
  });
});

describe('isDayInFuture', () => {
  it('treats tomorrow as future even when current time is late in the day', () => {
    const today = new Date(2026, 6, 9, 23, 30, 0);
    const tomorrow = new Date(2026, 6, 10, 0, 0, 0);

    expect(isDayInFuture(tomorrow, today)).toBe(true);
  });

  it('does not treat today as future', () => {
    expect(
      isDayInFuture(
        new Date('2026-07-09T00:00:00.000Z'),
        currentDate,
      ),
    ).toBe(false);
  });
});

describe('isScheduledTicket', () => {
  it('detects scheduled tickets by schedule_id', () => {
    expect(isScheduledTicket({ schedule_id: 4 })).toBe(true);
    expect(isScheduledTicket({ schedule_id: null })).toBe(false);
    expect(isScheduledTicket({})).toBe(false);
  });
});

describe('filterCalendarTickets', () => {
  const baseTicket = {
    id: 1,
    title: 'Open task',
    open: true,
    created_at: '2026-01-01T00:00:00.000Z',
    schedule_id: null,
  };

  it('keeps open tickets', () => {
    const result = filterCalendarTickets([baseTicket], {
      dayEnd,
      completedTicketIds: [],
    });
    expect(result).toHaveLength(1);
  });

  it('hides closed non-scheduled tickets', () => {
    const result = filterCalendarTickets(
      [{ ...baseTicket, open: false }],
      { dayEnd, completedTicketIds: [] },
    );
    expect(result).toHaveLength(0);
  });

  it('keeps closed scheduled tickets returned by the API', () => {
    const result = filterCalendarTickets(
      [{ ...baseTicket, open: false, schedule_id: 4 }],
      { dayEnd, completedTicketIds: [] },
    );
    expect(result).toHaveLength(1);
  });

  it('hides tickets created after the day without a due date', () => {
    const result = filterCalendarTickets(
      [{ ...baseTicket, created_at: '2026-07-11T00:00:00.000Z' }],
      { dayEnd, completedTicketIds: [] },
    );
    expect(result).toHaveLength(0);
  });

  it('keeps tickets created after the day when they have a due date', () => {
    const result = filterCalendarTickets(
      [{
        ...baseTicket,
        created_at: '2026-07-11T00:00:00.000Z',
        due_date: '2026-07-10T12:00:00.000Z',
      }],
      { dayEnd, completedTicketIds: [] },
    );
    expect(result).toHaveLength(1);
  });

  it('hides tickets completed on the same day', () => {
    const result = filterCalendarTickets(
      [{ ...baseTicket, schedule_id: 4 }],
      { dayEnd, completedTicketIds: [1] },
    );
    expect(result).toHaveLength(0);
  });
});

describe('getTicketChipStyle', () => {
  const categoryTicket = {
    id: 1,
    open: true,
    schedule_id: 4,
    category: { color: '#112233' },
    isCompletedTicket: false,
  };

  it('uses green styling for tickets completed on the day', () => {
    const style = getTicketChipStyle(categoryTicket, {
      completedTicketIds: [1],
      dayDate: new Date('2026-07-09T00:00:00.000Z'),
      currentDate,
    });
    expect(style.backgroundColor).toBe('#52c41a');
    expect(style.opacity).toBe(1);
  });

  it('uses muted styling for closed scheduled tickets on future days', () => {
    const style = getTicketChipStyle(
      { ...categoryTicket, open: false },
      {
        completedTicketIds: [],
        dayDate: new Date('2026-07-14T00:00:00.000Z'),
        currentDate,
      },
    );
    expect(style.backgroundColor).toBe('#112233');
    expect(style.opacity).toBe(0.45);
  });

  it('uses full opacity for reopened scheduled tickets on past days', () => {
    const style = getTicketChipStyle(categoryTicket, {
      completedTicketIds: [],
      dayDate: new Date('2026-07-08T00:00:00.000Z'),
      currentDate,
    });
    expect(style.backgroundColor).toBe('#112233');
    expect(style.opacity).toBe(1);
  });

  it('uses neutral color when no category is present', () => {
    const style = getTicketChipStyle(
      { id: 2, open: true, schedule_id: null, isCompletedTicket: false },
      {
        completedTicketIds: [],
        dayDate: new Date('2026-07-08T00:00:00.000Z'),
        currentDate,
      },
    );
    expect(style.backgroundColor).toBe('#d9d9d9');
  });
});