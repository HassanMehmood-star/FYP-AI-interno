import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "../App";
import Home from "../pages/home/Home";
import UserLogin from "../pages/auth/User_login";
import UserSignup from "../pages/auth/User_signup";
import IndustrypartnerSignup from "../pages/auth/Industrypartner_signup";
import IndustrypartnerLogin from "../pages/auth/Industrypartner_login";
import AdminLogin from "../pages/auth/Admin_login";
import Selectrole from "../pages/selectrole/Selectrole";
import Dashboard from "../pages/admindashboard/Dashboard";
import ProfileOverview from "../dashboardcomponents/ProfileOverview";
import { DashboardLayout } from "../pages/dashboard/Layouts";
import ProfileComplete from "../dashboardcomponents/ProfileComplete";
import LearningResurceHome from "../pages/learning resources/LearningResurceHome";
import Findinternship from "../pages/findinternship/Findinternship";
import CourseVideos from "../pages/learning resources/CoursesVideos"; // Import the CourseVideos component
import VideoPlayer from "../pages/learning resources/VideoPlayer";
// import AdminDashboard from "../pages/admindashboard/AdminDashboard";
import Sidebar from "../pages/admindashboard/Sidebar";
import Layout from "../pages/admindashboard/Layouts"; // Import the Layout Component
import Setting from "../pages/admindashboard/Setting";
import Notifications from "../pages/admindashboard/Notifications";
import ProtectedRoute from "../components/ProtectedRoute";
import Feedback from "../pages/admindashboard/Feedback";
import HallofFame from "../pages/admindashboard/HallofFame";
import DataAnalytics from "../pages/admindashboard/DataAnalytics";
import Mentor_chat from "../pages/chat/Mentor_chat";
import Internchat from "../pages/chat/Internchat";
import GiveFeedback from "../pages/Feedback/GiveFeedback";
import Forgetpassword from "../pages/ForgetPassword/Forgetpassword";
import VerifyOTP from "../pages/ForgetPassword/VerifyOTP";
import Newpassword from "../pages/ForgetPassword/Newpassword";
// import { useAuth } from "../components/AutContext";
import UserDashboard from "../dashboardcomponents/UserDashboard";
import UserApplication from "../aplication/UserApplication";
import PersonalInfo from "../aplication/PersonalInfo";
import EducationInfo from "../aplication/EducationInfo";
import SkillsInfo from "../aplication/SkillsInfo";
import Experience from "../aplication/Experience";
import IndustryLayout from "../../src/industrypartner/Layout";
import IndustryDashboard from "../industrypartner/IndustryDashboard";
import CompanyProfile from "../industrypartner/CompanyProfile";
import ProfileReview from "../industrypartner/ProfileReview";
import ProfileView from "../dashboardcomponents/ProfileView";
import InternshipRequirement from "../industrypartner/InternshipRequirement";
import CandidatesList from "../industrypartner/CandidatesList";
import UserProfileview from "../industrypartner/UserProfileview";
import ScheduleTest from "../industrypartner/ScheduleTest";
import TestSchedule from "../dashboardcomponents/TestSchedule";
import ManageHiring from "../industrypartner/ManageHiring";


const router = createBrowserRouter([
  {
    path: "/", // Unauthenticated routes
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/user_login",
        element: <UserLogin />,
      },
      {
        path: "/usersignup",
        element: <UserSignup />,
      },
      {
        path: "/industrypartner_signup",
        element: <IndustrypartnerSignup />,
      },
      {
        path: "/industrypartner_login",
        element: <IndustrypartnerLogin />,
      },
      {
        path: "/admin_login",
        element: <AdminLogin />,
      },
      {
        path: "/selectrole",
        element: <Selectrole />,
      },
      {
        path: "/forgetpassword",
        element: <Forgetpassword/>,
      },
      {
        path: "/verify-otp",
        element: <VerifyOTP/>,
      },
      {
        path: "/setnewpassword",
        element: <Newpassword/>,
      },
      {
        path: "/dashboard/UserApplication", 
        element: (
   
               <UserApplication/>
          
           ),
       },
      
      
       {
        path: "/dashboard/UserApplication/PersonalInfo", 
        element: (
   
               <PersonalInfo/>
          
           ),
       },
       {
        path: "/dashboard/UserApplication/EducationInfo", 
        element: (
   
               <EducationInfo/>
          
           ),
       },
       {
        path: "/dashboard/UserApplication/SkillsInfo", 
        element: (
   
               <SkillsInfo/>
          
           ),
       },
       {
        path: "/dashboard/UserApplication/ExperienceInfo", 
        element: (
   
               <Experience/>
          
           ),
       },
       
    ],
  },
  {
    path: "/dashboard", // Protected dashboard routes
    element: (
   
        <DashboardLayout />
      
    ),
    children: [
      {
        path: "/dashboard", 
        element: (
       
            <UserDashboard/>
         
        ),
      },
      {
        path: "/dashboard/profile-overview", 
        element: (
      
            <ProfileOverview /> 
        
        
        ),
      },
      {
        path: "/dashboard/profile-complete", 
        element: (
      
            <ProfileComplete />
        
        ),
      },
        {
          path: "/dashboard/TestSchedule",
          element: <TestSchedule/>,
  
         },
      
      {
        path: "/dashboard/learning-resource", 
        element: (
     
            <LearningResurceHome />
      
        ),
      },
      {
        path: "/dashboard/find-internship", 
        element: (
    
            <Findinternship />
         
        ),
      },
      {
        path: "/dashboard/course/:id", 
        element: (

            <CourseVideos />
  
        ),
      },
      {
        path: "/dashboard/video-player", 
        element: (
 
            <VideoPlayer />
        
        ),
      },
      {
        path: "/dashboard/mentorchat", 
        element: (
 
            <Mentor_chat/>
        
        ),
      },
      {
        path: "/dashboard/internchat", 
        element: (
 
            <Internchat/>
        
        ),
      },
      {
        path: "/dashboard/hallofFame", 
        element: (
 
            <HallofFame/>
        
        ),
      },
      {
        path: "/dashboard/giveFeedback", 
        element: (
 
            <GiveFeedback/>
        
        ),
      },
      {
        path: "/dashboard/ViewProfile", 
        element: (
 
            <ProfileView/>
        
        ),
      },
      
      // {
      //   path: "/dashboard/UserApplication", 
      //   element: (
 
      //       <UserApplication/>
        
      //   ),
      // }
    ],
  },
 
  {
    path: "/admindashboard", // Admin dashboard routes
    element: <Layout />, // Wraps the admin dashboard with the common Layout
    children: [
      {
        path: "/admindashboard", 
        element: <Dashboard/>, // Admin dashboard component
      },
      {
        path: "/admindashboard/manage-users", 
        element: <div>Manage Users</div>, // Add other admin-related pages here
      },
      {
        path: "/admindashboard/adminsettings", 
        element: <Setting/>, // Admin settings page
      },
      {
        path: "/admindashboard/notifications", 
        element: <Notifications/>, // Admin settings page
      },
      {
        path: "/admindashboard/feedback", 
        element: <Feedback/>, // Admin settings page
      },
      {
        path: "/admindashboard/hallofFame", 
        element: <HallofFame/>, // Admin settings page
      },
      {
        path: "/admindashboard/dataanalytics", 
        element: <DataAnalytics/>, // Admin settings page
      }
    ],
  },
  {
    path: "/industrtypartnerdashboard", // Admin dashboard routes
    element: <IndustryLayout/>, // Wraps the admin dashboard with the common Layout
    children: [
      {
        path: "/industrtypartnerdashboard", 
        element: <IndustryDashboard/>,
      },
      {
        path: "/industrtypartnerdashboard/Completeprofile", 
        element: <CompanyProfile/>,
      },
      {
        path: "/industrtypartnerdashboard/ProfileReview", 
        element: <ProfileReview/>,
      },
      {
        path: "/industrtypartnerdashboard/InternshipRequirement", 
        element: <InternshipRequirement/>,
      },
      {
        path: "/industrtypartnerdashboard/CandidatesList", 
        element: <CandidatesList/>,
      },
      {
        path: "/industrtypartnerdashboard/ViewProfile/:userId",  // Correctly nested ViewProfile route
        element: <UserProfileview />,
      },
      {
        path:"/industrtypartnerdashboard/ScheduleTest/:internshipId",
        element: <ScheduleTest />
      },
      {
        path:"/industrtypartnerdashboard/managehiring",
        element: <ManageHiring/>
      }
    ]
  },
  // Handle undefined routes
  {
    path: "*",
    element: <div>404 - Page Not Found</div>,
  },
]);

export default router;
