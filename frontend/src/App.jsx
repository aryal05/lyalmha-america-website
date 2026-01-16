import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Blogs from "./pages/Blogs";
import News from "./pages/News";
import Gallery from "./pages/Gallery";
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
import AdminContacts from "./pages/admin/AdminContacts";
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
            <Route path="/news" element={<News />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/culture" element={<Culture />} />
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
              path="/admin/contacts"
              element={
                <ProtectedRoute>
                  <AdminContacts />
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
