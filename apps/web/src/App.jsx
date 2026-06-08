import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import { Toaster } from './components/ui/sonner.jsx';
import HomePage from './pages/HomePage.jsx';
import ResultPage from './pages/ResultPage.jsx';
import ReportPage from './pages/ReportPage.jsx';
import LegalPage from './pages/LegalPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import RelationFormPage from './pages/RelationFormPage.jsx';
import RelationResultPage from './pages/RelationResultPage.jsx';
import RelationReportPage from './pages/RelationReportPage.jsx';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/codigo" element={<ResultPage />} />
            <Route path="/codigo/informe" element={<ReportPage />} />
            <Route path="/informes" element={<ReportsPage />} />
            <Route path="/conjunto/:type" element={<RelationFormPage />} />
            <Route path="/conjunto/:type/resultado" element={<RelationResultPage />} />
            <Route path="/conjunto/:type/informe" element={<RelationReportPage />} />
            <Route path="/privacidad" element={<LegalPage docKey="privacy" />} />
            <Route path="/terminos" element={<LegalPage docKey="terms" />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster richColors position="top-center" />
    </Router>
  );
}

export default App;