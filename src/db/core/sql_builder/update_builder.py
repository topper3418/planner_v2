def get_update_query(table_model) -> tuple[str, tuple]:
    set_clauses = []
    params = ()
    for field_name in table_model.get_column_fields(
        exclude_pk=True
    ).keys():
        value = getattr(table_model, field_name)
        set_clauses.append(f"{field_name} = ?")
        params += (value,)
    set_clause_str = ", ".join(set_clauses)
    pk_field_name = table_model.get_pk_field()
    if pk_field_name is None:
        raise ValueError("Primary key field not found")
    query = f"UPDATE {table_model.__table_name__} SET {set_clause_str} WHERE {pk_field_name} = ?"
    params += (getattr(table_model, pk_field_name),)
    return query, params
