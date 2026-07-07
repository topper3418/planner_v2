import useMutation from '../util/useMutation';

const useAddMilestoneToTicket = () => {
  const { data, loading, error, mutate: addMilestone } = useMutation(
    (ticketId, milestoneId) => ({
      path: `/api/tickets/${ticketId}/add_milestone`,
      body: { milestone_id: milestoneId },
    }),
    { method: 'POST', errorPrefix: 'HTTP error on update' },
  );

  return { data, loading, error, addMilestone };
};

export default useAddMilestoneToTicket;