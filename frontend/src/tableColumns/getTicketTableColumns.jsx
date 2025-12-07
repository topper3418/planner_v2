const getColumns = (cols = ["Title", "Thing", "Category"]) => {
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const configuredColumns = {
    Title: {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    Thing: {
      title: "Thing",
      dataIndex: ["thing", "name"],
      key: "thing_name",
    },
    Category: {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category_name",
      render: (text, record) => {
        console.log("Rendering category:", record);
        return (
          <span
            style={{
              backgroundColor: record.category?.color,
              padding: "2px 6px",
              borderRadius: "4px",
            }}
          >
            {text}
          </span>
        );
      },
    },
    Created: {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => formatDate(text),
    },
    ["Assigned User"]: {
      title: "Assigned User",
      dataIndex: ["user", "username"],
      key: "user",
    },
    Updated: {
      title: "Updated",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (text) => formatDate(text),
    },
  };
  return cols.map((col) => configuredColumns[col]);
};

export default getColumns;
