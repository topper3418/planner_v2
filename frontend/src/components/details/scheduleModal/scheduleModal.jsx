import { Descriptions, Input, Modal, Radio, Select } from "antd";
import { useEffect, useState } from "react";

const ScheduleModal = ({ modalControl }) => {
  const updateScheduleField = () => {
    if (modalControl.mode !== "edit") return "weekdays";
    if (modalControl.schedule.weekdays?.length > 0) return "weekdays";
    if (modalControl.schedule.monthdays?.length > 0) return "monthdays";
    if (modalControl.schedule.yeardays?.length > 0) return "yeardays";
    return "weekdays"; // fallback
  }
  const [scheduleField, setScheduleField] = useState(updateScheduleField());
  useEffect(() => {
    setScheduleField(updateScheduleField());
  }, [
    modalControl.mode,
    modalControl.schedule?.weekdays,
    modalControl.schedule?.monthdays,
    modalControl.schedule?.yeardays
  ]);
  const { title, isOpen, close, submit } = modalControl[modalControl.mode];
  const { schedule, error, loading } = modalControl;
  return (
    <Modal
      title={title}
      open={isOpen}
      onOk={submit}
      error={error}
      loading={loading}
      onCancel={close}>
      <Descriptions
        column={1}
        error={error}
        bordered
        size="small">
        <Descriptions.Item label="Name" >
          <Input
            placeholder="Schedule Name"
            value={schedule?.name}
            onChange={(e) => schedule?.set?.name(e.target.value)} />
        </Descriptions.Item>
        <Descriptions.Item label={
          <Radio
            checked={scheduleField === "weekdays"}
            onChange={() => setScheduleField("weekdays")}>
            Weekdays
          </Radio>
        }>
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Select Weekdays"
            value={schedule?.weekdays?.map(String)}
            disabled={scheduleField !== "weekdays"}
            onChange={(value) => schedule?.set?.weekdays(value)}
            options={modalControl.weekdaysOptions.map((day, index) => (
              { label: day, value: index.toString() }
            ))} />
        </Descriptions.Item>
        <Descriptions.Item label={
          <Radio
            checked={scheduleField === "monthdays"}
            onChange={() => setScheduleField("monthdays")}>
            Monthdays
          </Radio>
        }>
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Select Monthdays"
            value={schedule?.monthdays}
            disabled={scheduleField !== "monthdays"}
            onChange={(value) => schedule?.set?.monthdays(value)}
            options={modalControl.monthDayOptions.map((day) => (
              { label: day, value: day }
            ))} />
        </Descriptions.Item>
        <Descriptions.Item label={
          <Radio
            checked={scheduleField === "yeardays"}
            onChange={() => setScheduleField("yeardays")}>
            Yeardays
          </Radio>
        }>
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Select Yeardays"
            value={schedule?.yeardays}
            disabled={scheduleField !== "yeardays"}
            onChange={(value) => schedule?.set?.yeardays(value)}
            options={modalControl.yearDayOptions.map((day) => (
              { label: day, value: day }
            ))} />
        </Descriptions.Item>
      </Descriptions>
    </Modal >
  );
}


export default ScheduleModal;
