import { Navigate, Route, Routes } from "react-router";

import HomePage from "./pages/HomePage.jsx";
import FriendsPage from "./pages/FriendsPage.jsx";
import LearnersPage from "./pages/LearnersPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import DeveloperPage from "./pages/DeveloperPage.jsx";
import WhatsNextPage from "./pages/WhatsNextPage.jsx";
import LearnPage from "./pages/LearnPage.jsx";
import BackendFilesPage from "./pages/BackendFilesPage.jsx";
import FrontendFilesPage from "./pages/FrontendFilesPage.jsx";
import TermsPage from "./pages/TermsPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import MessagesPage from "./pages/MessagesPage.jsx";

import { Toaster } from "react-hot-toast";

import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import useMessageNotifications from "./hooks/useMessageNotifications.js";
import Layout from "./components/Layout.jsx";
import { LEARNER_ACCESS_EMAIL } from "./constants/index.js";

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  useMessageNotifications(authUser);

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;
  const isLearnerAllowed = authUser?.email?.toLowerCase() === LEARNER_ACCESS_EMAIL;
  const isAdmin = authUser?.role === "admin";

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen" data-theme="night">
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <HomePage />
              </Layout>
            ) : isAuthenticated ? (
              <Navigate to="/onboarding" />
            ) : (
              <LandingPage />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? <SignUpPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
          }
        />
        <Route
          path="/friends"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <FriendsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/learners"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <LearnersPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/messages"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <MessagesPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/chat/group/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route path="/developer" element={<DeveloperPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route
          path="/admin"
          element={
            isAuthenticated && isAdmin ? (
              <Layout showSidebar={true}>
                <AdminPage />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/whats-next" element={<WhatsNextPage />} />
        <Route path="/learn" element={isLearnerAllowed ? <LearnPage /> : <Navigate to="/" />} />
        <Route
          path="/learn/backend"
          element={isLearnerAllowed ? <BackendFilesPage /> : <Navigate to="/" />}
        />
        <Route
          path="/learn/frontend"
          element={isLearnerAllowed ? <FrontendFilesPage /> : <Navigate to="/" />}
        />

        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>

      <Toaster />
    </div>
  );
};
export default App;