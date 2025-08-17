import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="text-base-content mt-12 w-full bg-gray-50 border-t border-gray-200">
      <div className="w-full max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left: About Us */}
        <div className="flex flex-col items-center md:items-start gap-3 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2 w-full">
            <img src="https://i.ibb.co.com/997xV0ft/ee6be43b-e07b-4cf9-ab7d-3c6e8e8696ff.png" alt="Logo" className="w-10 h-10 object-contain" />
            <span className="font-bold text-xl text-primary">MediMart</span>
          </div>
          <p className="text-sm text-gray-600 max-w-xs mx-auto md:mx-0">
            MediMart is your trusted online pharmacy, providing quality medicines and health products at your doorstep. We are committed to your well-being and convenience.
          </p>
        </div>
        {/* Center: Contact Details */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h3 className="font-semibold text-lg text-indigo-700 mb-1">Contact Us</h3>
          <div className="flex flex-col gap-2 w-full items-center">
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.72 11.06a2.25 2.25 0 10-3.18 3.18l.7.7a2.25 2.25 0 003.18-3.18l-.7-.7z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12a9.75 9.75 0 1119.5 0 9.75 9.75 0 01-19.5 0z" /></svg>
              <span>123 Health St, Wellness City, 12345</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12v1a4 4 0 01-8 0v-1" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 16v2m0 0h.01M12 18a6 6 0 100-12 6 6 0 000 12z" /></svg>
              <a href="mailto:support@medimart.com" className="hover:underline">support@medimart.com</a>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A2 2 0 007.48 19h9.04a2 2 0 001.83-1.3L21 13M7 13V6a1 1 0 011-1h5a1 1 0 011 1v7" /></svg>
              <span>+1 (555) 123-4567</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-2 text-sm justify-center items-center w-full">
            <Link to="/privacy" className="link link-hover">Privacy Policy</Link>
            <span className="hidden sm:inline">|</span>
            <Link to="/terms" className="link link-hover">Terms of Service</Link>
          </div>
        </div>
        {/* Right: Social Media */}
        <div className="flex flex-col items-center md:items-end gap-3 text-center md:text-right">
          <h3 className="font-semibold text-lg text-indigo-700 mb-1">Follow Us</h3>
          <div className="flex gap-4 justify-center md:justify-end w-full">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg className="w-7 h-7 text-blue-600 hover:text-blue-800 transition" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg className="w-7 h-7 text-sky-500 hover:text-sky-700 transition" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 01-2.828.775 4.932 4.932 0 002.165-2.724c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 00-8.384 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.116 2.823 5.247a4.904 4.904 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 01-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 010 21.543a13.94 13.94 0 007.548 2.209c9.142 0 14.307-7.721 13.995-14.646A9.936 9.936 0 0024 4.557z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg className="w-7 h-7 text-pink-500 hover:text-pink-700 transition" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.131 4.602.425 3.635 1.392 2.668 2.359 2.374 3.532 2.315 4.81 2.256 6.09 2.243 6.5 2.243 12c0 5.5.013 5.91.072 7.19.059 1.278.353 2.451 1.32 3.418.967.967 2.14 1.261 3.418 1.32 1.28.059 1.689.072 7.19.072s5.91-.013 7.19-.072c1.278-.059 2.451-.353 3.418-1.32.967-.967 1.261-2.14 1.32-3.418.059-1.28.072-1.689.072-7.19s-.013-5.91-.072-7.19c-.059-1.278-.353-2.451-1.32-3.418C19.549.425 18.376.131 17.098.072 15.819.013 15.409 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/></svg>
            </a>
          </div>
          <span className="text-xs text-gray-500 mt-4 block">&copy; {new Date().getFullYear()} MediMart. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
