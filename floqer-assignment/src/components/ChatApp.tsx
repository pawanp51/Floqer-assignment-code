import React, { useState } from 'react';
import axios from 'axios';
import { Layout, Input, Button, List } from 'antd';

const { TextArea } = Input;

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<{ type: string; text: string }[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { type: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await axios.post('http://localhost:5000/chat', { message: input });
      setMessages([...newMessages, { type: 'bot', text: response.data.response }]);
    } catch (error) {
      setMessages([...newMessages, { type: 'bot', text: 'Error: Unable to fetch response' }]);
    }
  };

  return (
    <Layout style={{ padding: '0 24px 24px' }}>
      <List
        dataSource={messages}
        renderItem={item => (
          <List.Item style={{ textAlign: item.type === 'user' ? 'right' : 'left' }}>
            <List.Item.Meta
              title={item.type === 'user' ? 'You' : 'Bot'}
              description={item.text}
            />
          </List.Item>
        )}
        style={{ marginBottom: '16px' }}
      />
      <TextArea
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onPressEnter={sendMessage}
        placeholder="Ask a question about ML Engineer salaries"
      />
      <Button type="primary" onClick={sendMessage} style={{ marginTop: '10px' }}>
        Send
      </Button>
    </Layout>
  );
};

export default ChatApp;
