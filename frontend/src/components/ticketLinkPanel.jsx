import { Button, Card, Flex, Input, List, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import TicketLinkTypeDropdown from "./inputs/ticketLinkTypeDropdown";


const TicketLinkPanel = ({ api, beginAdd }) => {
  console.log("ticket links:", api.ticket.links.list.data);

  return (
    <Card
      title="Links"
      style={{ width: '300px', height: "100%" }}
      extra={<Button type="primary" onClick={beginAdd}>Add Link</Button>}
    >
      <Flex vertical justify="space-between" style={{ height: "100%" }}>
        <Flex vertical style={{ paddingTop: "10px", overflowY: 'auto', flex: 1, height: "100%" }}>
          <List
            loading={api.ticket.links.list.loading}
            dataSource={api.ticket.links.list.data || []}
            renderItem={(link) => (
              <List.Item
                style={{
                  padding: '10px',
                }}
              >
                <Flex justify="space-between" gap="10px" style={{
                  width: '100%',
                }}>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() =>
                      api.ticket.links.remove.remove(link.id).then(() => api.refreshAll())
                    }
                  />
                  <Typography.Link
                    href={link.link.startsWith('http') ? link.link : `https://${link.link}`}
                    target="_blank"
                    style={{
                      padding: "5px",
                      backgroundColor: link.link_type?.color || 'transparent',
                      flex: 1,
                      borderRadius: "5px",
                    }}>
                    {link.label}
                  </Typography.Link>
                </Flex>
              </List.Item>
            )} />
        </Flex>
      </Flex>
    </Card >
  )
}


export default TicketLinkPanel;
