import { useState } from 'react';
import { Input, message, Modal } from 'antd';
import useCreateThing from '../api/useCreateThing';


const NewThingModal = ({ open, setOpen, onSubmit }) => {
  const [newThingName, setNewThingName] = useState('');
  const { createThing } = useCreateThing();
  const clearNewThingForm = () => {
    setNewThingName('');
    setOpen(false);
  }
  const submitNewThing = async () => {
    try {
      await createThing(newThingName);
      clearNewThingForm();
      message.success('Thing created successfully');
      onSubmit();
    } catch (err) {
      console.error('Failed to create thing:', err);
      message.error(`Failed to create thing: ${err.message}`);
    }
  }

  return (
    <Modal
      title="Create New Thing"
      open={open}
      onOk={submitNewThing}
      onCancel={clearNewThingForm}
    >
      <Input
        placeholder="Thing Name"
        value={newThingName}
        onChange={(e) => setNewThingName(e.target.value)}
      />
    </Modal>
  );
};
export default NewThingModal;
