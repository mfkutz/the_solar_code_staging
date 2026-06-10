import React from 'react';
import { Route, Routes, Navigate, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import { Toaster } from './components/ui/sonner.jsx';
import AuthDialog from './auth/AuthDialog.jsx';
import HomePage from './pages/HomePage.jsx';
import ResultPage from './pages/ResultPage.jsx';
import ReportPage from './pages/ReportPage.jsx';
import LegalPage from './pages/LegalPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import RelationFormPage from './pages/RelationFormPage.jsx';
import RelationResultPage from './pages/RelationResultPage.jsx';
import RelationReportPage from './pages/RelationReportPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Full-screen pages — no Header/Footer */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/admin" element={<AdminPage />} />

        {/* All other pages share the standard shell */}
        <Route path="*" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/code" element={<ResultPage />} />
                <Route path="/code/report" element={<ReportPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/history" element={<Navigate to="/dashboard" replace />} />
                <Route path="/relation/:type" element={<RelationFormPage />} />
                <Route path="/relation/:type/result" element={<RelationResultPage />} />
                <Route path="/relation/:type/report" element={<RelationReportPage />} />
                <Route path="/privacy" element={<LegalPage docKey="privacy" />} />
                <Route path="/terms" element={<LegalPage docKey="terms" />} />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
      <AuthDialog />
      <Toaster richColors position="top-center" />
    </Router>
  );
}

export default App;