import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import ResultPage from './pages/ResultPage.jsx';
import ReportPage from './pages/ReportPage.jsx';
import LegalPage from './pages/LegalPage.jsx';

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
            <Route path="/privacidad" element={<LegalPage docKey="privacy" />} />
            <Route path="/terminos" element={<LegalPage docKey="terms" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;