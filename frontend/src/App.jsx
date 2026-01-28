import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Gallery from "./pages/Gallery";
import GalleryEventDetail from "./pages/GalleryEventDetail";
import UpcomingEvents from "./pages/UpcomingEvents";
import Culture from "./pages/Culture";
import Contact from "./pages/Contact";
import KidsActivitiesPage from "./pages/KidsActivitiesPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminNews from "./pages/admin/AdminNews";
import AdminTeam from "./pages/admin/AdminTeam";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminSupporters from "./pages/admin/AdminSupporters";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminStories from "./pages/admin/AdminStories";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminActivities from "./pages/admin/AdminActivities";
import AdminRSVPs from "./pages/admin/AdminRSVPs";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminFestivals from "./pages/admin/AdminFestivals";
import LoadingScreen from "./components/LoadingScreen";
import ScrollToTopOnMount from "./components/ScrollToTopOnMount";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <LoadingScreen />
      <AuthProvider>
        <Router>
          <ScrollToTopOnMount />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/events" element={<UpcomingEvents />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/gallery/event/:id" element={<GalleryEventDetail />} />
            <Route path="/culture-and-tradition" element={<Culture />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/kids-activities" element={<KidsActivitiesPage />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/blogs"
              element={
                <ProtectedRoute>
                  <AdminBlogs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/team"
              element={
                <ProtectedRoute>
                  <AdminTeam />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events"
              element={
                <ProtectedRoute>
                  <AdminEvents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/supporters"
              element={
                <ProtectedRoute>
                  <AdminSupporters />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/banners"
              element={
                <ProtectedRoute>
                  <AdminBanners />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/news"
              element={
                <ProtectedRoute>
                  <AdminNews />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/gallery"
              element={
                <ProtectedRoute>
                  <AdminGallery />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/stories"
              element={
                <ProtectedRoute>
                  <AdminStories />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/contacts"
              element={
                <ProtectedRoute>
                  <AdminContacts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/activities"
              element={
                <ProtectedRoute>
                  <AdminActivities />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/rsvps"
              element={
                <ProtectedRoute>
                  <AdminRSVPs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/projects"
              element={
                <ProtectedRoute>
                  <AdminProjects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/festivals"
              element={
                <ProtectedRoute>
                  <AdminFestivals />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App
