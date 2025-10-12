import { Button, Card, Descriptions, Flex, Input } from "antd"
import { useEffect, useState } from "react";
import ThingDropdown from "../inputs/thingDropdown";
import api from "../../api/";
import ThingCategoryDropdown from "../inputs/thingCategoryDropdown";


const ThingDetails = ({ thing, loading, error, refreshThing }) => {
  const {
    mode,
    setMode,
    changeHandler,
    getValue,
    resetChanges,
    updateData,
    updateLoading,
    updateError,
    updateThing

  } = detailsHooks(thing);

  return (
    <Card
      title="Thing"
      extra={
        <ModeButton
          mode={mode}
          setMode={setMode} />
      }
      style={{
        marginTop: '10px',
        padding: '10px',
        width: '250px',
      }}
    >
      <Flex vertical>
        <Descriptions
          column={1}
          error={error}
          size="small">
          <Descriptions.Item label="Name">
            {mode === "view" ?
              thing?.name :
              <Input
                value={getValue("name")}
                onChange={changeHandler("name")} />}
          </Descriptions.Item>
          <Descriptions.Item label="Docs Link">
            {mode === "view" ?
              (thing?.docs_link ?
                <a
                  href={thing?.docs_link}
                  target="_blank"
                  rel="noopener noreferrer">
                  {thing?.docs_link}
                </a> :
                'No link') :
              <Input
                value={getValue("docs_link")}
                onChange={changeHandler("docs_link")} />}
          </Descriptions.Item>
          <Descriptions.Item label="category">
            {mode === "view" ?
              (thing?.category ? thing.category.name : 'Uncategorized') :
              <ThingCategoryDropdown
                selectedThingCategoryId={getValue("category_id")}
                setSelectedThingCategoryId={(value) => {
                  const e = { target: { value } };
                  changeHandler("category_id")(e);
                }} />}
          </Descriptions.Item>
          <Descriptions.Item label="Parent">
            {mode === "view" ?
              (thing?.parent ? thing.parent.name : 'No parent') :
              <ThingDropdown
                selectedThingId={getValue("parent_id")}
                setSelectedThingId={(value) => {
                  const e = { target: { value } };
                  changeHandler("parent_id")(e);
                }} />}
          </Descriptions.Item>
          <Descriptions.Item label="Description">
            {mode === "view" ?
              (thing?.description ? thing.description : 'No description') :
              <Input.TextArea
                value={getValue("description")}
                onChange={changeHandler("description")}
                autoSize={{ minRows: 3, maxRows: 5 }} />}
          </Descriptions.Item>
        </Descriptions>
        <Flex justify="end">
          {mode === "edit" &&
            <Button
              type="primary"
              onClick={() => {
                const updatedThing = {
                  id: thing.id,
                  name: getValue("name"),
                  docs_link: getValue("docs_link"),
                  category: getValue("category"),
                  parent: getValue("parent"),
                  description: getValue("description"),
                };
                console.log("Updating thing with data:", updatedThing);
                updateThing(updatedThing);
              }}>
              Save
            </Button>}
        </Flex>
      </Flex>
    </Card>
  )
}

const ModeButton = ({ mode, setMode }) => {
  const onClick = () => {
    if (mode === "view") {
      setMode("edit");
    } else {
      setMode("view");
    }
  }
  return (
    <Button type="primary" onClick={onClick}>
      {mode === "view" ? "Edit" : "Cancel"}
    </Button>
  )
}

const detailsHooks = (thing) => {
  const [mode, setMode] = useState("view"); // "view" or "edit"
  const [unsavedChanges, setUnsavedChanges] = useState({});

  const isChanged = (field) => {
    return unsavedChanges[field] !== undefined;
  }

  const changeHandler = (field) => {
    return (e) => {
      const newValue = e.target.value;
      setUnsavedChanges({
        ...unsavedChanges,
        [field]: newValue,
      });
    }
  }

  const {
    data: updateData,
    loading: updateLoading,
    error: updateError,
    updateThing
  } = api.useUpdateThing();

  const getValue = (field) => {
    return isChanged(field) ? unsavedChanges[field] : thing ? thing[field] : '';
  }

  const resetChanges = () => {
    setUnsavedChanges({});
  }

  // when going to view mode, reset unsaved changes
  useEffect(() => {
    if (mode === "view") {
      // Reset unsaved changes when switching back to view mode
      resetChanges();
    }
  }, [mode])

  // when updateData is available, refresh the thing details
  useEffect(() => {
    if (updateData) {
      console.log("Thing updated:", updateData);
      refreshThing();
      setMode("view");
    }
  }, [updateLoading])

  return {
    mode,
    setMode,
    changeHandler,
    getValue,
    resetChanges,
    updateData,
    updateLoading,
    updateError,
    updateThing
  };
}

export default ThingDetails;
