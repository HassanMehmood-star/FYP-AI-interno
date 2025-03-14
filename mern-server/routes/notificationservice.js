// src/services/notificationService.js

import axios from 'axios';

const fetchNotifications = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/admin/notifications', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,  // If you're using auth
      },
    });
    return response.data.notifications;  // Assuming this is the structure of your response
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];  // Return an empty array in case of error
  }
};

export default fetchNotifications;
