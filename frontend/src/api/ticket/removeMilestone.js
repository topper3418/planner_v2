import useMutation from '../util/useMutation';

const useRemoveMilestoneFromTicket = () => {
  const { data, loading, error, mutate: removeMilestone } = useMutation(
    (ticketId, milestoneId) => ({
      path: `/api/tickets/${ticketId}/remove_milestone`,
      body: { milestone_id: milestoneId },
    }),
    { method: 'POST', errorPrefix: 'HTTP error on update' },
  );

  return { data, loading, error, removeMilestone };
};

export default useRemoveMilestoneFromTicket;