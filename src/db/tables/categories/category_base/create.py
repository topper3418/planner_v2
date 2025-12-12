from ....core import DbCore, ExceptionPackage

from .base import Category


def create(self: Category) -> int:
    self.__logger__.info(f"Creating new {self.__class__}: {self}")
    core = DbCore()
    core.logger = self.__logger__
    query = f"INSERT INTO {self.__table_name__} (name, description, color) VALUES (?, ?, ?)"
    params = (self.name, self.description, self.color)
    exception_package = ExceptionPackage(
        unique_constraint_error=f"{self.__class__} name '{self.name}' already exists"
    )
    last_row_id = core.run_create(query, params, exception_package)
    self.id = last_row_id
    return last_row_id
