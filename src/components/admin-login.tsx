"use client";

import React, { useEffect, useState } from "react";

export function AdminLogin() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("adminEmail");
    if (stored) setAdminEmail(stored);
  }, []);

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }
    localStorage.setItem("adminEmail", email);
    setAdminEmail(email);
    setOpen(false);
    setEmail("");
  };

  const handleLogout = () => {
    localStorage.removeItem("adminEmail");
    setAdminEmail(null);
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        {adminEmail ? (
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm">
              <div className="font-medium">Admin</div>
              <div className="text-xs text-muted-foreground">{adminEmail}</div>
            </div>
            <div className="flex gap-2">
              <button
                className="rounded px-2 py-1 text-sm bg-red-50 text-red-700 border border-red-100"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <button
            className="w-full rounded bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700"
            onClick={() => setOpen(true)}
          >
            Admin Login
          </button>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <form
            onSubmit={handleLogin}
            className="relative z-10 w-full max-w-md bg-white rounded-lg p-6 shadow"
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
            }}
          >
            <h3 className="text-lg font-semibold mb-4">Admin Login</h3>
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-2"
              placeholder="admin@example.com"
              required
            />
            {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-3 py-2 rounded border"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="px-3 py-2 rounded bg-blue-600 text-white">
                Sign in
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}