import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Internchat = () => {
  const [activeGroup, setActiveGroup] = useState('Web Development');
  const [messages, setMessages] = useState({
    'Web Development': [
      { text: 'Hey team! Let’s discuss the project requirements.', sender: 'Alice Johnson', avatar: 'https://randomuser.me/api/portraits/men/10.jpg', time: '10:15 AM' },
      { text: 'I am working on the login page.', sender: 'Bob Smith', avatar: 'https://randomuser.me/api/portraits/men/21.jpg', time: '10:30 AM' },
    ],
    'Data Science': [
      { text: 'How are we doing with the data cleaning?', sender: 'Charlie Brown', avatar: 'https://randomuser.me/api/portraits/men/22.jpg', time: '11:05 AM' },
      { text: 'I finished preprocessing the data.', sender: 'David Clark', avatar: 'https://randomuser.me/api/portraits/men/23.jpg', time: '11:20 AM' },
    ],
  });

  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setMessages({
        ...messages,
        [activeGroup]: [
          ...messages[activeGroup],
          { text: inputMessage, sender: 'Alice Johnson', avatar: 'https://randomuser.me/api/portraits/men/10.jpg', time: currentTime },
        ],
      });
      setInputMessage('');
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-purple-600 to-indigo-700">
      {/* Sidebar with Group Names */}
      <div className="w-1/4 bg-gray-800 text-white p-4">
        <h2 className="text-3xl font-bold text-center mb-6 text-purple-100">Intern Chats</h2>
        <div className="space-y-2">
          {['Web Development', 'Data Science'].map((group) => (
            <motion.div
              key={group}
              className={`p-3 rounded-md cursor-pointer transition-all ${activeGroup === group ? 'bg-purple-500 text-white' : 'hover:bg-gray-600'}`}
              onClick={() => setActiveGroup(group)}
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-lg font-medium">{group}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-white p-6 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <h1 className="text-3xl font-bold text-gray-800">{activeGroup} Chat</h1>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages[activeGroup].map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`flex items-start space-x-4 ${message.sender === 'Alice Johnson' ? 'justify-end' : 'justify-start'}`}
            >
              {/* Display Avatar and Name */}
              <div className="flex items-center space-x-3">
                <img
                  src={message.avatar}
                  alt={message.sender}
                  className="w-10 h-10 rounded-full border-2 border-purple-500"
                />
                <span className="text-sm font-semibold text-gray-800">{message.sender}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${message.sender === 'Alice Johnson' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                <p>{message.text}</p>
              </div>

              {/* Message Time */}
              <div className="text-xs text-gray-500 self-end">
                {message.time}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input Message Area */}
        <div className="flex items-center border-t border-gray-200 p-4 bg-white">
          <input
            type="text"
            className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <motion.button
            onClick={handleSendMessage}
            className="ml-4 bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Send
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Internchat;
