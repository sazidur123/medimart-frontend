import React, { useState, useRef, useEffect } from "react";
import i18n from "../i18n";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../firebase";
import { Menu, X } from "lucide-react";

const languages = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
];

function DigitalClock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n) => n.toString().padStart(2, "0");
  const formatted = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(
    time.getSeconds()
  )}`;

  return (
    <span className="font-mono text-sm px-3 py-1 bg-base-200 rounded select-none hidden sm:inline-block">
      {formatted}
    </span>
  );
}

function Navbar({ user, onLogout, cartCount = 0 }) {
  const [selectedLang, setSelectedLang] = useState(
    i18n.language || languages[0].code
  );
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const auth = getAuth(app);

  useEffect(() => {
    i18n.changeLanguage(selectedLang);
  }, [selectedLang]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (typeof onLogout === "function") onLogout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // Routes for different states
  const loggedOutLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];
  const userLinks = [
    { path: "/", label: "Home" },
    { path: "/orders", label: "My Orders" },
    { path: "/prescription", label: "Prescription" },
    { path: "/support", label: "Support" },
    { path: "/about", label: "About" },
    { path: "/shop", label: "Shop" },
    { path: "/cart", label: "Cart" },
  ];
  const adminSellerLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/support", label: "Support" },
  ];

  let navLinks = loggedOutLinks;
  if (user) {
    if (user.role === "admin" || user.role === "seller") navLinks = adminSellerLinks;
    else navLinks = userLinks;
  }

  // nav link render function
  const renderLinks = (isMobile = false) =>
    navLinks.map((link) =>
      link.label === "Cart" ? (
        <li key={link.path} className="relative">
          <Link
            to={link.path}
            onClick={() => isMobile && setMobileOpen(false)}
            aria-label="Cart"
            className="hover:text-primary transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m1-9h2m-6 0H5"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-error text-white rounded-full text-xs px-2 py-0.5 font-bold">
                {cartCount}
              </span>
            )}
          </Link>
        </li>
      ) : (
        <li key={link.path}>
          <Link
            to={link.path}
            onClick={() => isMobile && setMobileOpen(false)}
            className="hover:text-primary transition-colors"
          >
            {link.label}
          </Link>
        </li>
      )
    );

  return (
    <nav className="bg-base-100 shadow sticky top-0 z-50 w-full">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img
            src="https://i.ibb.co.com/997xV0ft/ee6be43b-e07b-4cf9-ab7d-3c6e8e8696ff.png"
            alt="Logo"
            className="w-10 h-10 object-contain"
          />
          <span className="font-extrabold text-2xl text-primary select-none hidden sm:inline">
            MediMart
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4">
          <DigitalClock />
          <ul className="flex items-center gap-6 font-semibold text-gray-700">
            {renderLinks()}
            <li>
              <select
                className="select select-bordered select-sm min-w-[100px] cursor-pointer"
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </li>
          </ul>

          {/* Auth/User */}
          {!user ? (
            <button
              onClick={() => navigate("/signup")}
              className="btn btn-primary normal-case text-sm px-4 py-2 rounded-lg shadow-md hover:shadow-lg"
            >
              Join Us
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full border-2 border-primary overflow-hidden">
                  <img
                    src={user.photoURL || "/default-avatar.png"}
                    alt={user.displayName || "Profile"}
                    loading="lazy"
                  />
                </div>
              </button>
              {open && (
                <ul className="absolute top-16 right-0 bg-base-100 rounded-lg shadow-lg p-4 flex flex-col gap-2 z-50 w-48">
                  <li>
                    <Link
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                      className="px-4 py-2 rounded hover:bg-primary hover:text-white"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setOpen(false)}
                      className="px-4 py-2 rounded hover:bg-primary hover:text-white"
                    >
                      Update Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-error hover:bg-error hover:text-white rounded"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setMobileOpen((p) => !p)}>
            {mobileOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-base-100 border-t shadow">
          <ul className="flex flex-col p-4 space-y-3 font-semibold text-gray-700">
            {renderLinks(true)}
            <li>
              <select
                className="select select-bordered select-sm w-full cursor-pointer"
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </li>
            {!user ? (
              <li>
                <button
                  onClick={() => {
                    navigate("/signup");
                    setMobileOpen(false);
                  }}
                  className="btn btn-primary w-full"
                >
                  Join Us
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2 rounded hover:bg-primary hover:text-white"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/update-profile"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2 rounded hover:bg-primary hover:text-white"
                  >
                    Update Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-error hover:bg-error hover:text-white rounded"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
