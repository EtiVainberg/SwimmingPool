import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './components/Home.tsx'
import SignUp from './components/SignUp.tsx'
import SignIn from './components/SignIn.tsx'
import Checkout from './components/CheckOut.tsx'
import Contact from './components/Contact.tsx'
import Satisfaction from './components/Satisfaction.tsx'
import About from './components/About.tsx'
import Courses from './components/Courses.tsx'
import Management from './components/Management.tsx'
// import GetUsers from './components/ManageUsers.tsx'
import AddCourse from './components/AddCourse.tsx'
// import Comments from './components/Comments.tsx'
import CourseSchedule from './components/CourseSchedule.tsx'
import Schedule from './components/Schedule.tsx'
import ManageUsers from './components/ManageUsers.tsx'
import ManageContact from './components/ManageContact.tsx'
import ManageCourses from './components/ManageCourses.tsx'
import manageAttendance from './components/ManageAttendance.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        path: 'home',
        Component: Home,
      },
      {
        path: 'sign-in',
        Component: SignIn,
      },
      {
        path: 'sign-up',
        Component: SignUp,
      },
      {
        path: 'contact',
        Component: Contact,
      },
      {
        path: 'check-out',
        Component: Checkout,
      },
      {
        path: 'courseSchedule',
        Component: CourseSchedule,
      },
      {
        path: 'satisfaction',
        Component: Satisfaction,
      },
      {
        path: 'courses',
        Component: Courses,
      },
      {
        path: 'about',
        Component: About,
      },
      {
        path: 'management',
        Component: Management,
      },
      {
        path: 'manageUsers',
        Component: ManageUsers,
      },
      {
        path: 'AddCourse',
        Component: AddCourse,
      },
      {
        path: 'manageContact',
        Component: ManageContact,
      },
      {
        path: 'ManageCourses',
        Component: ManageCourses,
      },
      {
        path: 'schedule',
        Component: Schedule,
      },
      {
        path: 'manageAttendance',
        Component: manageAttendance,
      },
    ],
  },
])
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.Fragment>
    <RouterProvider router={router} />
  </React.Fragment>,
)
