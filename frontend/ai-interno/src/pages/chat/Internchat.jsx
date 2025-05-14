"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send,
  Smile,
  Paperclip,
  Search,
  Menu,
  X,
  Plus,
  Users,
  MessageSquare,
  Bell,
  Settings,
  ImageIcon,
} from "lucide-react"
import axios from "axios"

const Internchat = () => {
  const [groups, setGroups] = useState([])
  const [messages, setMessages] = useState({})
  const [activeGroup, setActiveGroup] = useState(null)
  const [inputMessage, setInputMessage] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [showUserList, setShowUserList] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  // Retrieve JWT token from localStorage
  const JWT_TOKEN = localStorage.getItem("token") || ""
  console.log("JWT local Token found :", JWT_TOKEN)

  // Check authentication status
  useEffect(() => {
    if (JWT_TOKEN) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
      console.error("No JWT token found. Please log in.")
      // Redirect to login page (e.g., using react-router-dom)
      // window.location.href = "/login"
    }
  }, [JWT_TOKEN])

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!JWT_TOKEN) return
      try {
        const response = await axios.get("http://localhost:5000/api/autho/me", {
          headers: { Authorization: `Bearer ${JWT_TOKEN}` },
        })
        setCurrentUser({
          id: response.data.id,
          name: response.data.name,
          avatar: response.data.avatar || "https://randomuser.me/api/portraits/men/44.jpg",
        })
      } catch (error) {
        console.error("Error fetching current user:", error)
        if (error.response?.status === 401) {
          localStorage.removeItem("jwt_token")
          setIsAuthenticated(false)
          setCurrentUser(null)
          // Redirect to login page
          // window.location.href = "/login"
        }
      }
    }
    fetchCurrentUser()
  }, [JWT_TOKEN])

  // Fetch chat groups
 useEffect(() => {
  const fetchGroups = async () => {
    if (!JWT_TOKEN) {
      console.log("fetchGroups: No JWT token found, skipping request")
      return
    }
    console.log("fetchGroups: Initiating GET /api/chat-groups with token:", JWT_TOKEN)
    try {
      const response = await axios.get("http://localhost:5000/api/chat-groups", {
        headers: { Authorization: `Bearer ${JWT_TOKEN}` },
      })
      console.log("fetchGroups: Response received:", response.data)
      setGroups(
        response.data.map(group => ({
          id: group._id,
          name: group.name,
          members: group.members,
          unread: 0,
        }))
      )
      if (response.data.length > 0) {
        console.log("fetchGroups: Setting active group to:", response.data[0]._id)
        setActiveGroup(response.data[0]._id)
      } else {
        console.log("fetchGroups: No groups found in response")
      }
    } catch (error) {
      console.error("fetchGroups: Error fetching groups:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
      if (error.response?.status === 401) {
        console.log("fetchGroups: Unauthorized (401), clearing token and redirecting")
        localStorage.removeItem("token") // Fixed from "jwt_token" to "token"
        setIsAuthenticated(false)
        setCurrentUser(null)
        // Redirect to login page
        // window.location.href = "/login"
      }
    }
  }
  console.log("fetchGroups: useEffect triggered")
  fetchGroups()
}, [JWT_TOKEN])


  // Fetch messages and poll for updates
  useEffect(() => {
    if (activeGroup && currentUser && JWT_TOKEN) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/chat-groups/${activeGroup}/messages`,
            {
              headers: { Authorization: `Bearer ${JWT_TOKEN}` },
            }
          )
          setMessages(prev => ({
            ...prev,
            [activeGroup]: response.data.map(msg => ({
              id: msg._id,
              text: msg.text,
              sender: {
                id: msg.sender.userId,
                name: msg.sender.name,
                avatar: msg.sender.avatar || "/placeholder.svg",
                status: "online",
              },
              reactions: msg.reactions.map(r => r.reaction),
              timestamp: new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              date: new Date(msg.timestamp).toDateString(),
            })),
          }))
        } catch (error) {
          console.error("Error fetching messages:", error)
          if (error.response?.status === 401) {
            localStorage.removeItem("jwt_token")
            setIsAuthenticated(false)
            setCurrentUser(null)
            // Redirect to login page
            // window.location.href = "/login"
          }
        }
      }
      fetchMessages()
      const interval = setInterval(fetchMessages, 5000)
      return () => clearInterval(interval)
    }
  }, [activeGroup, currentUser, JWT_TOKEN])

  // Check if on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setShowSidebar(false)
        setShowUserList(false)
      }
    }
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, activeGroup])

  // Handle sending a message
  const handleSendMessage = async () => {
    if (inputMessage.trim() && activeGroup) {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/chat-groups/${activeGroup}/messages`,
          { text: inputMessage },
          { headers: { Authorization: `Bearer ${JWT_TOKEN}` } }
        )
        setMessages(prev => ({
          ...prev,
          [activeGroup]: [
            ...(prev[activeGroup] || []),
            {
              id: response.data._id,
              text: response.data.text,
              sender: {
                id: currentUser.id,
                name: currentUser.name,
                avatar: currentUser.avatar,
                status: "online",
              },
              reactions: [],
              timestamp: new Date(response.data.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              date: new Date(response.data.timestamp).toDateString(),
            },
          ],
        }))
        setInputMessage("")
      } catch (error) {
        console.error("Error sending message:", error)
      }
    }
  }

  // Handle adding a reaction
  const handleReaction = async (messageId, reaction) => {
    try {
      const message = messages[activeGroup].find(msg => msg.id === messageId)
      const isExisting = message.reactions.includes(reaction)

      await axios.post(
        `http://localhost:5000/api/messages/${messageId}/reactions`,
        { reaction },
        { headers: { Authorization: `Bearer ${JWT_TOKEN}` } }
      )

      setMessages(prev => ({
        ...prev,
        [activeGroup]: prev[activeGroup].map(msg =>
          msg.id === messageId
            ? {
                ...msg,
                reactions: isExisting
                  ? msg.reactions.filter(r => r !== reaction)
                  : [...msg.reactions, reaction],
              }
            : msg
        ),
      }))
    } catch (error) {
      console.error("Error adding reaction:", error)
    }
  }

  // Handle file upload (placeholder)
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Backend doesn't support file uploads; add message as text
      const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      const newMessage = {
        id: Date.now().toString(), // Temporary ID
        text: `Shared a file: ${file.name}`,
        sender: currentUser,
        reactions: [],
        timestamp: currentTime,
        date: new Date().toDateString(),
        isFile: true,
        fileName: file.name,
        fileType: file.type,
      }

      setMessages(prev => ({
        ...prev,
        [activeGroup]: [...(prev[activeGroup] || []), newMessage],
      }))
    }
  }

  // Filter groups based on search query
  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get active users in the current group
  const activeUsers = groups.find(group => group.id === activeGroup)?.members || []

  // Common emojis for reactions
  const commonEmojis = ["👍", "❤️", "😂", "🎉", "🚀", "👏", "🔥"]

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="fixed top-4 left-4 z-50 p-2 bg-black rounded-full text-white shadow-lg"
        >
          {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-0 z-40 bg-white dark:bg-gray-900 p-4"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-black">InternChat</h1>
                <button onClick={() => setShowMobileMenu(false)}>
                  <X size={24} />
                </button>
              </div>

              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search chats..."
                    className="w-full p-3 pl-10 rounded-lg bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <h2 className="text-lg font-semibold mb-2 text-gray-600 dark:text-gray-400">Channels</h2>
                <div className="space-y-1 mb-6">
                  {filteredGroups.map(group => (
                    <div
                      key={group.id}
                      className={`p-3 rounded-lg cursor-pointer flex items-center justify-between ${
                        activeGroup === group.id
                          ? "bg-purple-100 dark:bg-teal-900 text-teal-600 dark:text-purple-300"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => {
                        setActiveGroup(group.id)
                        setShowMobileMenu(false)
                      }}
                    >
                      <div className="flex items-center">
                        <MessageSquare size={18} className="mr-2" />
                        <span>{group.name}</span>
                      </div>
                      {group.unread > 0 && (
                        <span className="bg-teal-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {group.unread}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <h2 className="text-lg font-semibold mb-2 text-gray-600 dark:text-gray-400">Group Members</h2>
                <div className="space-y-1">
                  {activeUsers.map(user => (
                    <div
                      key={user.userId}
                      className="p-3 rounded-lg cursor-pointer flex items-center hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <div className="relative">
                        <img src="/placeholder.svg" alt={user.name} className="w-8 h-8 rounded-full" />
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-green-500"></span>
                      </div>
                      <span className="ml-3">{user.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                  <img
                    src={currentUser?.avatar || "/placeholder.svg"}
                    alt={currentUser?.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="ml-3">
                    <div className="font-medium">{currentUser?.name}</div>
                    <div className="text-xs text-green-500">Online</div>
                  </div>
                  <Settings size={18} className="ml-auto text-gray-500" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(showSidebar || !isMobile) && (
          <motion.div
            initial={isMobile ? { x: "-100%" } : false}
            animate={{ x: 0 }}
            exit={isMobile ? { x: "-100%" } : false}
            className={`${
              isMobile ? "fixed inset-y-0 left-0 z-30" : "relative"
            } w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col`}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-2xl font-bold text-teal-600 flex items-center">
                <MessageSquare className="mr-2" size={24} />
                InternChat
              </h1>
            </div>

            <div className="p-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search chats..."
                  className="w-full p-3 pl-10 rounded-lg bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400">CHANNELS</h2>
                <button className="text-gray-500 hover:text-teal-600">
                  <Plus size={18} />
                </button>
              </div>

              <div className="space-y-1 mb-6">
                {filteredGroups.map(group => (
                  <motion.div
                    key={group.id}
                    className={`p-3 rounded-lg cursor-pointer flex items-center justify-between ${
                      activeGroup === group.id
                        ? "bg-purple-100 dark:bg-teal-900 text-teal-600 dark:text-purple-300"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setActiveGroup(group.id)}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center">
                      <MessageSquare size={18} className="mr-2" />
                      <span>{group.name}</span>
                    </div>
                    {group.unread > 0 && (
                      <span className="bg-teal-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {group.unread}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                {/* <img
                  src={currentUser?.avatar || "/placeholder.svg"}
                  alt={currentUser?.name}
                  className="w-10 h-10 rounded-full"
                /> */}
                <div className="ml-3">
                  <div className="font-medium">{currentUser?.name}</div>
                  <div className="text-xs text-green-500">Online</div>
                </div>
                <Settings size={18} className="ml-auto text-gray-500" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center">
            {!isMobile && (
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="mr-4 text-gray-500 hover:text-teal-600"
              >
                <Menu size={20} />
              </button>
            )}
            <h2 className="text-xl font-bold">
              {groups.find(group => group.id === activeGroup)?.name || "Select a group"}
            </h2>
            <div className="ml-4 flex items-center text-sm text-gray-500">
              <Users size={16} className="mr-1" />
              <span>{activeUsers.length} members</span>
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={() => setShowUserList(!showUserList)}
              className={`p-2 rounded-full ${
                showUserList
                  ? "bg-purple-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300"
                  : "text-gray-500 hover:text-teal-600"
              }`}
            >
              <Users size={20} />
            </button>
            <button className="ml-2 p-2 rounded-full text-gray-500 hover:text-teal-600">
              <Bell size={20} />
            </button>
            <button className="ml-2 p-2 rounded-full text-gray-500 hover:text-teal-600">
              <Search size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4">
              {messages[activeGroup]?.map((message, index) => {
                const showDateDivider =
                  index === 0 || messages[activeGroup][index - 1].date !== message.date
                const isCurrentUser = message.sender.id === currentUser?.id

                return (
                  <div key={message.id}>
                    {showDateDivider && (
                      <div className="flex justify-center my-4">
                        <div className="px-4 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-sm text-gray-600 dark:text-gray-300">
                          {message.date}
                        </div>
                      </div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex mb-4 ${isCurrentUser ? "justify-end" : "justify-start"}`}
                    >
                      {!isCurrentUser && (
                        <div className="flex-shrink-0 mr-3">
                          <div className="relative">
                            {/* <img
                              src={message.sender.avatar}
                              alt={message.sender.name}
                              className="w-10 h-10 rounded-full"
                            /> */}
                            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-green-500"></span>
                          </div>
                        </div>
                      )}

                      <div className={`max-w-md ${isCurrentUser ? "order-1" : "order-2"}`}>
                        {!isCurrentUser && (
                          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            {message.sender.name}
                          </div>
                        )}

                        <div className="flex flex-col">
                          <div
                            className={`px-4 py-3 rounded-2xl ${
                              isCurrentUser
                                ? "bg-teal-600 text-white rounded-tr-none"
                                : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none shadow-sm"
                            }`}
                          >
                            {message.isFile ? (
                              <div className="flex items-center">
                                <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-lg mr-3">
                                  <ImageIcon size={24} className="text-gray-600 dark:text-gray-300" />
                                </div>
                                <div>
                                  <div className="font-medium">{message.fileName}</div>
                                  <div className="text-xs opacity-70">Click to download</div>
                                </div>
                              </div>
                            ) : (
                              <p className="whitespace-pre-wrap">{message.text}</p>
                            )}
                          </div>

                          <div className="flex items-center mt-1">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {message.timestamp}
                            </div>

                            {message.reactions.length > 0 && (
                              <div className="ml-2 flex">
                                {Array.from(new Set(message.reactions)).map((reaction, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1 text-xs mr-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                                    onClick={() => handleReaction(message.id, reaction)}
                                  >
                                    <span>{reaction}</span>
                                    <span className="ml-1">
                                      {message.reactions.filter(r => r === reaction).length}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="relative ml-2 group">
                              <button
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => setShowEmojiPicker(message.id)}
                              >
                                <Smile size={16} />
                              </button>

                              {showEmojiPicker === message.id && (
                                <div className="absolute bottom-full mb-2 -left-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 z-10">
                                  <div className="flex">
                                    {commonEmojis.map((emoji, i) => (
                                      <button
                                        key={i}
                                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                        onClick={() => {
                                          handleReaction(message.id, emoji)
                                          setShowEmojiPicker(false)
                                        }}
                                      >
                                        {emoji}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {isCurrentUser && (
                        <div className="flex-shrink-0 ml-3 order-2">
                          <img
                            src={message.sender.avatar}
                            alt={message.sender.name}
                            className="w-10 h-10 rounded-full"
                          />
                        </div>
                      )}
                    </motion.div>
                  </div>
                )
              })}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <button
                  className="p-2 text-gray-500 hover:text-teal-600"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip size={20} />
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                </button>

                <div className="relative flex-1 mx-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="w-full p-3 rounded-full bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={inputMessage}
                    onChange={e => setInputMessage(e.target.value)}
                    onKeyPress={e => e.key === "Enter" && handleSendMessage()}
                  />
                  <button
                    className="absolute right-3 top-3 text-gray-500 hover:text-teal-600"
                    onClick={() => setShowEmojiPicker("input")}
                  >
                    <Smile size={20} />
                  </button>

                  {showEmojiPicker === "input" && (
                    <div className="absolute bottom-full mb-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 z-10">
                      <div className="grid grid-cols-7 gap-1">
                        {commonEmojis.map((emoji, i) => (
                          <button
                            key={i}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-xl"
                            onClick={() => {
                              setInputMessage(inputMessage + emoji)
                              setShowEmojiPicker(false)
                            }}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                  onClick={handleSendMessage}
                >
                  <Send size={20} />
                </motion.button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showUserList && !isMobile && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 250, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold">Group Members</h3>
                </div>

                <div className="p-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search members..."
                      className="w-full p-2 pl-8 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    />
                    <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                      MEMBERS - {activeUsers.length}
                    </h4>
                    <div className="space-y-3">
                      {activeUsers.map(user => (
                        <div key={user.userId} className="flex items-center">
                          <div className="relative">
                            {/* <img src="/placeholder.svg" alt={user.name} className="w-8 h-8 rounded-full" /> */}
                            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-white bg-green-500"></span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium">{user.name}</div>
                            <div className="text-xs text-gray-500">Active</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default Internchat