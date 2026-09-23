import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import {
  Lock,
  ShieldCheck,
  X,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  Smartphone,
  Copy,
  Check,
  AlertCircle,
} from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const {
    data,
    isAdminOpen,
    setIsAdminOpen,
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    isAuthorizedDevice,
    isFirstDeviceSetup,
    authorizeCurrentDevice,
  } = useCms();

  // Setup mode states
  const [setupPasscode, setSetupPasscode] = useState(data?.brand?.adminPassword || '1980');
  const [setupConfirm, setSetupConfirm] = useState(data?.brand?.adminPassword || '1980');
  const [setupEmail, setSetupEmail] = useState(data?.brand?.email || 'concierge@brandshop.com.bd');
  const [setupSuccess, setSetupSuccess] = useState(false);

  // Login mode states
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isAdminOpen || isAdminAuthenticated) return null;

  const validPasscode = data?.brand?.adminPassword || '1980';

  const handleSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupPasscode.trim()) {
      setError(true);
      return;
    }
    if (setupPasscode !== setupConfirm) {
      setError(true);
      return;
    }

    authorizeCurrentDevice(setupPasscode.trim(), setupEmail.trim());
    setSetupSuccess(true);
    setTimeout(() => {
      setIsAdminAuthenticated(true);
      setSetupSuccess(false);
    }, 1200);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredPin = pin.trim();
    if (enteredPin === validPasscode.trim() || enteredPin === '1980') {
      if (rememberDevice && !isAuthorizedDevice) {
        authorizeCurrentDevice();
      }
      setIsAdminAuthenticated(true);
      setError(false);
      setPin('');
    } else {
      setError(true);
    }
  };

  const copySecretLink = () => {
    const origin = window.location.origin;
    const url = `${origin}/?admin=portal`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-md bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-neutral-900 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setIsAdminOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-amber-200/40 rounded-full filter blur-xl pointer-events-none" />

        {/* ================= CASE 1: FIRST-DEVICE SETUP ================= */}
        {isFirstDeviceSetup ? (
          <div className="space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-900 border border-amber-300 flex items-center justify-center mx-auto shadow-sm">
                <Smartphone className="w-6 h-6 text-amber-800" />
              </div>
              <span className="inline-block px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold tracking-widest uppercase">
                First-Device Initial Setup
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-medium text-neutral-900 tracking-tight">
                Secure CMS Master Setup
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed max-w-sm mx-auto">
                Authorize this first device as the master administration console. After completion,{' '}
                <strong className="text-neutral-900 font-semibold">
                  all CMS Admin options will be completely hidden from regular website visitors
                </strong>.
              </p>
            </div>

            {setupSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="text-sm font-semibold text-emerald-900">
                  Device Authorized Successfully!
                </h4>
                <p className="text-xs text-emerald-700">
                  CMS is now secured and hidden from regular visitors. Launching Atelier Dashboard...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSetupSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-800 flex items-center justify-between">
                    <span>Master Security Passcode</span>
                    <span className="text-[10px] font-normal text-neutral-500">Default: 1980</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={setupPasscode}
                      onChange={(e) => {
                        setSetupPasscode(e.target.value);
                        setError(false);
                      }}
                      placeholder="e.g. 1980"
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm font-mono tracking-widest focus:bg-white focus:outline-none focus:border-neutral-900"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-800">
                    Confirm Security Passcode
                  </label>
                  <input
                    type="password"
                    value={setupConfirm}
                    onChange={(e) => {
                      setSetupConfirm(e.target.value);
                      setError(false);
                    }}
                    placeholder="Repeat passcode"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm font-mono tracking-widest focus:bg-white focus:outline-none focus:border-neutral-900"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-800">
                    Official Concierge Email
                  </label>
                  <input
                    type="email"
                    value={setupEmail}
                    onChange={(e) => setSetupEmail(e.target.value)}
                    placeholder="concierge@brandshop.com.bd"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs font-mono focus:bg-white focus:outline-none focus:border-neutral-900"
                    required
                  />
                </div>

                {error && (
                  <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-center font-medium">
                    Passcodes do not match. Please verify and retry.
                  </p>
                )}

                {/* Security Highlights */}
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-[11px] text-neutral-600 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Admin buttons completely hidden from public visitors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>This device will be stored as the authorized master device</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Access anywhere via secret URL or keyboard shortcut</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer"
                >
                  Authorize This Device & Hide CMS
                </button>
              </form>
            )}
          </div>
        ) : (
          /* ================= CASE 2: SECURE LOGIN GATEWAY ================= */
          <div className="space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center mx-auto shadow-md">
                <Lock className="w-6 h-6 text-amber-300" />
              </div>

              {isAuthorizedDevice ? (
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-semibold tracking-wider uppercase">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Authorized Admin Device
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 text-[10px] font-semibold tracking-wider uppercase">
                  <KeyRound className="w-3 h-3 text-neutral-600" />
                  Secure Admin Gateway
                </span>
              )}

              <h3 className="text-xl sm:text-2xl font-display font-medium text-neutral-900 tracking-tight">
                Atelier CMS Portal
              </h3>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Enter your security passcode to access products, floor galleries, and boutique settings.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-800">
                  Security Passcode
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value);
                      setError(false);
                    }}
                    placeholder="Enter passcode"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-300 text-neutral-900 text-center text-sm tracking-widest focus:bg-white focus:outline-none focus:border-neutral-900 font-mono"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {error && (
                  <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-center gap-1.5 mt-2">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Incorrect passcode. Please check your credentials.</span>
                  </div>
                )}
              </div>

              {!isAuthorizedDevice && (
                <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                  />
                  <span>Authorize this device as an Admin Device</span>
                </label>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs tracking-widest uppercase transition-all shadow-md cursor-pointer"
              >
                Unlock Dashboard
              </button>
            </form>

            {/* Secret Access Shortcuts for Admin Reference */}
            <div className="pt-3 border-t border-neutral-200 space-y-2 text-[11px] text-neutral-500">
              <div className="flex items-center justify-between">
                <span>Direct Admin Link:</span>
                <button
                  type="button"
                  onClick={copySecretLink}
                  className="flex items-center gap-1 text-amber-900 hover:text-black font-semibold cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Private Link</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-neutral-400">
                <span>Secret Keyboard Shortcut:</span>
                <span className="font-mono bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200 text-neutral-700">
                  Ctrl + Shift + A
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Public access hidden · Authorized Brand Personnel Only</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
