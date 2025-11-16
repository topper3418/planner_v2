import { Button, Card, Flex, Input, Table } from "antd";
import useApi from "../api";
import { useState } from "react";
import { formatDate } from "../util/formatting";


const CommentPanel = ({ ticketId }) => {
  const { data, loading, error, refetch } = useApi.comment.fetchMany({ ticket_id: ticketId });
  const {
    data: createData,
    loading: createLoading,
    error: createError,
    create: createComment
  } = useApi.comment.create();

  const [newCommentText, setNewCommentText] = useState("");

  return (
    <Card title="Comments" style={{ height: '325px', width: '450px' }}>
      <Flex vertical justify="space-between">
        <Flex vertical style={{ overflowY: 'auto', flex: 1 }}>
          <Table
            showHeader={false}
            dataSource={data}
            loading={loading}
            scroll={{ y: 150 }}
            columns={[
              {
                title: 'Time',
                dataIndex: 'created_at',
                key: 'created_at',
                render: formatDate
              },
              {
                title: 'Comment',
                dataIndex: 'content',
                key: 'content',
              },
            ]}
            pagination={false} />
        </Flex>
        <Flex gap="10px">
          <Input.TextArea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            style={{ marginTop: '10px', marginRight: '10px', flex: 1 }} />
          <Button
            type="primary"
            loading={createLoading}
            error={createError}
            style={{ marginTop: '10px' }}
            onClick={async () => {
              if (newCommentText.trim() === "") return;
              await createComment({ ticket_id: ticketId, content: newCommentText });
              setNewCommentText("");
              refetch({ ticket_id: ticketId });
            }} >
            Add Comment
          </Button>
        </Flex>
      </Flex>
    </Card>
  )
}


export default CommentPanel;
