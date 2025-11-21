from datetime import date

from ..db.tables import Schedule


class Today:

    def __init__(self):
        self._today = date.today()

    def check_schedule(self, schedule: Schedule) -> bool:
        """Checks if the current date matches the given schedule"""
        if (
            schedule.weekdays
            and self.day_of_week in schedule.weekdays_list
        ):
            return True
        if (
            schedule.monthdays
            and self.day_of_month in schedule.monthdays_list
        ):
            return True
        if (
            schedule.yeardays
            and self.day_of_year in schedule.yeardays_list
        ):
            return True
        return False

    def set_date(self, new_date: date):
        """Sets the current date to a new date (for testing purposes)"""
        self._today = new_date

    @property
    def day_of_week(self) -> int:
        """Returns the current day of the week as a number,
        with monday being 0"""
        weekday_array = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ]
        return weekday_array.index(self._today.strftime("%A"))

    @property
    def day_of_month(self):
        """Returns the current day of the month"""
        return self._today.day

    @property
    def day_of_year(self):
        """Returns the current day of the year"""
        return self._today.timetuple().tm_yday

    def match(self, schedule: Schedule) -> bool:
        # check which schedule field is set
        if schedule.weekdays:
            return self.day_of_week in schedule.weekdays_list
        if schedule.monthdays:
            return self.day_of_month in schedule.monthdays_list
        if schedule.yeardays:
            return self.day_of_year in schedule.yeardays_list
        return False
