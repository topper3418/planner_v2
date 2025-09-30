from ....core import DbCore, ExceptionPackage


def delete(cls, category_id: int) -> None:
    cls.__logger__.info(f"Deleting {cls.__class__} with ID {category_id}")
    query = f"DELETE FROM {cls.__table_name__} WHERE id = ?"
    exception_package = ExceptionPackage(
        not_found_error=f"{cls.__class__} with ID {category_id} not found",
        foreign_key_constraint_error=f"Cannot delete {cls.__class__} ID {category_id}: it is referenced by other records",
    )
    DbCore.run_delete(query, category_id, exception_package)
