import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Analyze from './pages/Analyze';
import Results from './pages/Results';
import Trace from './pages/Trace';
import Report from './pages/Report';

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-holoDark text-slate-100 cyber-grid selection:bg-cyanGlow selection:text-black">
      
      {/* Top Cyber Command Navbar */}
      <Navbar />

      {/* Main Content Area with Animated Route Transitions */}
      <main className="flex-1 w-full mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10, filter: 'blur(3px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(3px)' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/analyze" element={<Analyze />} />
              <Route path="/results" element={<Results />} />
              <Route path="/trace" element={<Trace />} />
              <Route path="/report" element={<Report />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Cyber Command Footer */}
      <footer className="no-print mt-auto border-t border-holoBorder bg-holoDark/95 backdrop-blur-md py-6 text-xs font-mono text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5 text-emeraldAllow">
              <span className="w-2 h-2 rounded-full bg-emeraldAllow animate-ping" />
              <span>INGRESS DEFENSE: NOMINAL</span>
            </span>
            <span>•</span>
            <span>TrustGuard AI v1.0</span>
            <span>•</span>
            <span className="text-gray-400">SOC Node: us-east-01</span>
          </div>

          <div className="flex flex-wrap items-center space-x-4 text-gray-400">
            <span>TimeSformer-v1 (82%)</span>
            <span>Wav2Vec2 (76%)</span>
            <span>Scam-DeBERTa (91%)</span>
            <span className="text-crimsonBlock font-bold">Policy: 70%+ Block</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
