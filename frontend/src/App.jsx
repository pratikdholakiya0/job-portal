import { Navigate, Outlet, Route, Routes } from 'react-router'
import Home from './pages/Home'
import Login from './pages/Login'
import { Register } from './pages/Register'
import { useAuth } from './store/AuthContext'
import Profile from './pages/Profile'
import DeveloperPage from './pages/About'
import JobPostingForm from './pages/JobPostingForm'
import CompanyProfile from './pages/CompanyProfile'
import Header from './component/Header'
import JobEditForm from './component/JobEditForm'
import ResumeBuilder from './pages/ResumeBuilder'
import EmployerJobListing from './pages/EmployerJobListing'
import JobListing from './pages/JobListing'
import JobDetails from './component/JobDetails'
import Dashboard from './pages/UserDashboard'
import UserApplications from './pages/UseApplications'
import ApplicationDetail from './pages/ApplicationDetail'
import EmployerDashboard from './pages/EmployerDashboard'
import Chat from './pages/Chat'

export const ProtectedRoutes = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading Authentication...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export const EmployerAdminOnlyRoutes = () => {
    const { isAuthenticated, role, loading } = useAuth();

    if (loading) {
        return <div>Loading Authentication...</div>;
    }

    return ( isAuthenticated && (role==="EMPLOYER" || role==="ADMIN") )? <Outlet /> : <Navigate to="/" replace />;
};

function App() {

  return (
    <Routes>{/* Public Routes */}
      <Route path="/" element={<Home/>} />
      <Route path="/home" element={<Home/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path='/about-developer' element={<><Header/><DeveloperPage/></>} />

      {/* Protected Routes - All routes inside this must be authenticated */}
      <Route element={<ProtectedRoutes/>}> 
        <Route path="/user-profile" element={<><Header/><Profile/></>} />
        <Route path='/resume' element={<ResumeBuilder/>} />
        <Route path='/jobs' element={<><Header/><JobListing/></>} />
        <Route path='/applicant/dashboard' element={<><Header/><Dashboard/></>} />
        <Route path='/applicant/dashboard/my-applications' element={<><Header/><UserApplications/></>} />
        <Route path = "/chat" element={<><Chat/></>} />
        <Route path='/applicant/dashboard/my-applications/:applicationId' element={<><Header/><ApplicationDetail/></>} />
        <Route path='/jobs/view/:jobId' element={<><Header/><JobDetails/></>} />
      </Route>

      {/* Protected Routes - Admin and Employer */}
      <Route element={<EmployerAdminOnlyRoutes/>} >        
        <Route path='/employer/company-profile' element={<><Header/><CompanyProfile/></>} />
        <Route path='/employer/jobs' element={<><Header/><EmployerJobListing/></>} />
        <Route path='/employer/dashboard' element={<><Header/><EmployerDashboard/></>} />
        <Route path='/employer/jobs/create' element={<><Header/><JobPostingForm/></>} />
        <Route path='/employer/jobs/view/:jobId' element={<><Header/><JobEditForm/></>} />
      </Route>
      
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  )
}

export default App
