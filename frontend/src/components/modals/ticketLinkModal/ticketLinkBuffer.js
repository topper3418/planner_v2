import { useState } from "react";

const useTicketLinkBuffer = () => {
  const [mutateTicketLinkLabel, setMutateTicketLinkLabel] = useState("");
  const [mutateTicketLinkLink, setMutateTicketLinkLink] = useState("");
  const [mutateTicketLinkTypeId, setMutateTicketLinkTypeId] = useState(null);
  const milestoneModalReset = () => {
    setMutateTicketLinkLabel("");
    setMutateTicketLinkLink("");
    setMutateTicketLinkTypeId(null);
  };
  const mutateTicketLink = {
    label: mutateTicketLinkLabel,
    link: mutateTicketLinkLink,
    linkTypeId: mutateTicketLinkTypeId,
    set: {
      label: setMutateTicketLinkLabel,
      link: setMutateTicketLinkLink,
      linkTypeId: setMutateTicketLinkTypeId,
    },
    reset: milestoneModalReset,
  };
  return mutateTicketLink;
};

export default useTicketLinkBuffer;
