import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  ShieldAlert, 
  Search, 
  GitBranch, 
  FileText, 
  Menu, 
  X,
  Radio,
  Lock,
  ChevronRight,
  Activity,
  Database,
  Server,
  HardDrive,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [healthModalOpen, setHealthModalOpen] = useState(false);
  const [healthData, setHealthData] = useState({
    status: 'checking',
    engine: 'TrustGuard v1.0',
    connected_db: 'Supabase'
  });
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Activity },
    { path: '/analyze', label: 'Analyze', icon: Search },
    { path: '/results', label: 'Results', icon: ShieldAlert },
    { path: '/trace', label: 'Trace', icon: GitBranch },
    { path: '/report', label: 'Report', icon: FileText }
  ];

  // Poll backend health endpoint
  useEffect(() => {
    let isMounted = true;
    const checkHealth = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.HEALTH);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setHealthData({
              status: data.status || 'active',
              engine: data.engine || 'TrustGuard v1.0',
              connected_db: data.connected_db || 'Supabase'
            });
          }
        } else {
          if (isMounted) {
            setHealthData(prev => ({ ...prev, status: 'fallback' }));
          }
        }
      } catch (err) {
        if (isMounted) {
          setHealthData(prev => ({ ...prev, status: 'fallback' }));
        }
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const isOnline = healthData.status === 'active';

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#09071E]/80 border-b border-[#1F2937]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand: TrustGuard AI with glowing emerald active node */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-holoCard to-holoSurface border border-cyanGlow/40 shadow-cyan-sm group-hover:border-cyanGlow group-hover:shadow-cyan-glow transition-all">
                <ShieldAlert className="w-5 h-5 text-cyanGlow group-hover:scale-110 transition-transform" />
                {/* Glowing emerald active node */}
                <div className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emeraldAllow opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emeraldAllow border-2 border-holoDark"></span>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold tracking-wider text-base text-white group-hover:text-cyanAccent transition-colors">
                    TrustGuard <span className="text-cyanGlow">AI</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold tracking-widest uppercase bg-cyanGlow/10 text-cyanGlow rounded border border-cyanGlow/30">
                    v1.0
                  </span>
                </div>
                <p className="text-[10px] font-mono text-gray-400 tracking-wider hidden sm:block">
                  CYBER-DEFENSE FORENSIC SUITE
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
                      isActive
                        ? 'bg-holoCard text-cyanGlow border border-cyanGlow/50 shadow-cyan-sm'
                        : 'text-gray-300 hover:text-white hover:bg-holoSurface/60 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyanGlow' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Status Badges: Live Backend & Supabase Status */}
            <div className="hidden sm:flex items-center space-x-3">
              <button
                onClick={() => setHealthModalOpen(true)}
                title="Click for infrastructure telemetry"
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-[11px] font-mono font-semibold tracking-wider transition-all hover:scale-105 ${
                  isOnline 
                    ? 'bg-holoCard border-emeraldAllow/40 text-emeraldAllow shadow-emerald-sm'
                    : 'bg-holoCard border-amberWarn/40 text-amberWarn'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isOnline ? 'bg-emeraldAllow' : 'bg-amberWarn'
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${
                    isOnline ? 'bg-emeraldAllow' : 'bg-amberWarn'
                  }`}></span>
                </span>
                <span>
                  {isOnline ? `FastAPI • ${healthData.connected_db}` : 'Engine Standby (Fallback)'}
                </span>
              </button>

              <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-crimsonBlock/10 border border-crimsonBlock/30 text-crimsonBlock text-[11px] font-mono font-semibold">
                <Lock className="w-3 h-3 text-crimsonBlock" />
                <span>INGRESS BLOCK</span>
              </div>
            </div>

            {/* Mobile menu trigger */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-holoCard focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-holoDark/95 border-b border-[#1F2937] px-4 pt-2 pb-4 space-y-1 backdrop-blur-xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-mono ${
                    isActive
                      ? 'bg-holoCard text-cyanGlow border border-cyanGlow/40'
                      : 'text-gray-300 hover:bg-holoSurface'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-cyanGlow" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </NavLink>
              );
            })}
            
            <div className="pt-3 border-t border-[#1F2937] flex items-center justify-between text-xs font-mono text-gray-400">
              <span className={`flex items-center space-x-1.5 ${isOnline ? 'text-emeraldAllow' : 'text-amberWarn'}`}>
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emeraldAllow animate-pulse' : 'bg-amberWarn'}`} />
                <span>{isOnline ? `FastAPI + ${healthData.connected_db}` : 'Local Fallback'}</span>
              </span>
              <span className="text-crimsonBlock font-bold">Policy: 70%+ Block</span>
            </div>
          </div>
        )}
      </header>

      {/* Infrastructure Telemetry Modal */}
      {healthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0D111E] border border-cyanGlow/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center space-x-2 text-cyanGlow font-mono font-bold text-sm uppercase tracking-wider">
                <Server className="w-4 h-4" />
                <span>Backend & Database Infrastructure</span>
              </div>
              <button 
                onClick={() => setHealthModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800 space-y-1">
                <span className="text-gray-400 flex items-center space-x-1">
                  <Activity className="w-3.5 h-3.5 text-emeraldAllow" />
                  <span>Gateway Status</span>
                </span>
                <p className="text-white font-bold text-sm capitalize">{healthData.status}</p>
                <span className="text-[10px] text-emeraldAllow">FastAPI Inference Service</span>
              </div>

              <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800 space-y-1">
                <span className="text-gray-400 flex items-center space-x-1">
                  <Database className="w-3.5 h-3.5 text-cyanGlow" />
                  <span>Connected DB</span>
                </span>
                <p className="text-white font-bold text-sm">{healthData.connected_db}</p>
                <span className="text-[10px] text-cyanGlow">PostgreSQL Schema Migrated</span>
              </div>

              <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800 space-y-1">
                <span className="text-gray-400 flex items-center space-x-1">
                  <HardDrive className="w-3.5 h-3.5 text-purple-400" />
                  <span>Evidence Vault</span>
                </span>
                <p className="text-white font-bold text-sm">evidence-vault</p>
                <span className="text-[10px] text-purple-400">Private Bucket (50MB Limit)</span>
              </div>

              <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800 space-y-1">
                <span className="text-gray-400 flex items-center space-x-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-crimsonBlock" />
                  <span>Containment Policy</span>
                </span>
                <p className="text-white font-bold text-sm">3-Tier Enforcement</p>
                <span className="text-[10px] text-crimsonBlock">0-39% Pass | 40-69% Warn | 70%+ Block</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs font-mono space-y-1.5 text-gray-300">
              <div className="flex items-center space-x-2 text-cyanGlow font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Active Model Checkpoints</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-gray-400 pl-1">
                <li>Video: <code className="text-gray-200">trustguard/timesformer-deepfake-v1</code></li>
                <li>Voice: <code className="text-gray-200">trustguard/wav2vec2-synthetic-voice</code></li>
                <li>Text: <code className="text-gray-200">trustguard/scam-deberta-v3-intent</code></li>
                <li>Document: <code className="text-gray-200">trustguard/docu-tamper-vit-ocr</code></li>
              </ul>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setHealthModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-cyanGlow text-black font-bold text-xs font-mono hover:brightness-110 transition-all"
              >
                Close Telemetry
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
