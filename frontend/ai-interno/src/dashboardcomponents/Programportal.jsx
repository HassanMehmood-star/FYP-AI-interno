"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Calendar, CheckCircle, Clock, FileText, User, AlertCircle, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Simplified Card component with animation
const Card = ({ children, className, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </motion.div>
)

// Task status badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { color: "bg-amber-100 text-amber-800 border border-amber-200", icon: <Clock className="w-3 h-3 mr-1" /> },
    inProgress: {
      color: "bg-blue-100 text-blue-800 border border-blue-200",
      icon: <FileText className="w-3 h-3 mr-1" />,
    },
    completed: {
      color: "bg-green-100 text-green-800 border border-green-200",
      icon: <CheckCircle className="w-3 h-3 mr-1" />,
    },
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <span className={`flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${config.color} shadow-sm`}>
      {config.icon}
      {status === "pending" ? "Pending" : status === "inProgress" ? "In Progress" : "Completed"}
    </span>
  )
}

// Task card component
const TaskCard = ({ task, onMarkComplete }) => {
  const [expanded, setExpanded] = useState(false)

  // Mock data for demonstration - in real app, this would come from the task object
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 14) + 1)
  const status = ["pending", "inProgress", "completed"][Math.floor(Math.random() * 3)]

  return (
    <motion.div
      layout
      className="border-2 border-[#0A3A3A]/20 rounded-lg shadow-sm bg-white overflow-hidden hover:shadow-md transition-all hover:border-[#0A3A3A]/40 hover:translate-y-[-2px]"
    >
      <div className="p-4 cursor-pointer flex justify-between items-start" onClick={() => setExpanded(!expanded)}>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-[#0A3A3A]">{task.title}</h3>
            <StatusBadge status={status} />
          </div>
          <p className="text-gray-600 text-sm line-clamp-2 whitespace-pre-line">{task.description}</p>
        </div>
        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? "rotate-90" : ""}`} />
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-[#0A3A3A]/10 bg-gradient-to-r from-[#f0f7f7] to-white"
          >
            <div className="p-4">
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Due: {dueDate.toLocaleDateString()}</span>
              </div>
              <p className="text-gray-700 mb-4 whitespace-pre-line">{task.description}</p>
              {status !== "completed" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onMarkComplete(task._id)
                  }}
                  className="text-sm px-4 py-2 bg-[#0A3A3A] text-white rounded-md hover:bg-[#0c4747] transition-colors shadow-sm hover:shadow"
                >
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  Mark as Complete
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Skeleton loader component
const SkeletonLoader = () => (
  <div className="space-y-4 animate-pulse">
    {[1, 2, 3].map((i) => (
      <div key={i} className="border border-gray-100 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    ))}
  </div>
)

// User info header component
const UserHeader = ({ userName = "User" }) => (
  <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
    <div className="w-10 h-10 rounded-full bg-[#0A3A3A] flex items-center justify-center text-white">
      <User className="w-5 h-5" />
    </div>
    <div className="ml-3">
      <p className="text-sm text-gray-500">Welcome back,</p>
      <h2 className="font-bold text-[#0A3A3A]">{userName}</h2>
    </div>
  </div>
)

const ProgramPortal = () => {
  const [tasks, setTasks] = useState([])
  const [userId, setUserId] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("Candidate")

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Token not found")
        }

        const response = await axios.get("/api/getUserDetails", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data && response.data._id) {
          setUserId(response.data._id)
          if (response.data.name) {
            setUserName(response.data.name)
          }
        } else {
          throw new Error("No user ID returned")
        }
      } catch (error) {
        console.error("Error fetching user details:", error)
        setError(error.message || "Failed to fetch user details")
      }
    }

    fetchUserDetails()
  }, [])

  useEffect(() => {
    const fetchHiredCandidateTasks = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token || !userId) {
          console.error("Token or userId not found")
          return
        }

        const response = await axios.get("/api/hired-candidate-tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            userId: userId,
          },
        })

        console.log("Hired candidate tasks response:", response.data)

        if (response.data.status === "success" && response.data.data) {
          setTasks(response.data.data)
        } else {
          setTasks([])
        }
      } catch (error) {
        console.error("Error fetching hired candidate tasks:", error)
        setError(error.message || "Failed to fetch tasks")
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchHiredCandidateTasks()
    }
  }, [userId])

  const handleMarkComplete = async (taskId) => {
    console.log(`Marking task ${taskId} as complete`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <Card className="mx-auto max-w-6xl">
        <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-[#0A3A3A]">Program Portal</h1>
            <div className="hidden md:block px-4 py-2 bg-[#0A3A3A]/10 rounded-lg text-[#0A3A3A] text-sm font-medium">
              Candidate Dashboard
            </div>
          </div>

          <UserHeader userName={userName} />

          {loading ? (
            <SkeletonLoader />
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          ) : tasks.length > 0 ? (
            <div className="bg-gradient-to-br from-[#f0f7f7] to-white p-5 rounded-xl border border-[#0A3A3A]/10 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#0A3A3A] flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-[#0A3A3A]/70" />
                  Your Assigned Tasks
                </h2>
                <div className="text-sm bg-[#0A3A3A]/10 px-3 py-1 rounded-full text-[#0A3A3A] font-medium">
                  {tasks.length} tasks
                </div>
              </div>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {tasks.map((task) => (
                  <TaskCard key={task._id} task={task} onMarkComplete={handleMarkComplete} />
                ))}
              </motion.div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-[#0A3A3A] mb-2">No Tasks Available</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                You don't have any assigned tasks at the moment. Check back later or contact your program manager.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default ProgramPortal
