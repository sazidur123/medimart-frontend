import React, { useState } from "react";
import { Menu, X } from "lucide-react"; 

function Sidebar({ role, activeTab, setActiveTab, setSearchParams }) {
  const [isOpen, setIsOpen] = useState(false);

  const links = {
    admin: [
      { key: "home", label: "Home" },
      { key: "users", label: "Manage Users" },
      { key: "categories", label: "Manage Category" },
      { key: "payments", label: "Payment Management" },
      { key: "sales", label: "Sales Report" },
      { key: "banners", label: "Manage Banner Advertise" },
    ],
    seller: [
      { key: "home", label: "Home" },
      { key: "medicines", label: "Manage Medicines" },
      { key: "sellerPayments", label: "Payment History" },
      { key: "adRequests", label: "Ask For Advertisement", route: "/dashboard/ad-requests" },
    ],
    user: [
      { key: "userPayments", label: "Payment History" },
    ],
  };

  return (
    <div className="relative">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 text-gray-600 focus:outline-none"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        w-64 max-w-full pt-16
        lg:translate-x-0 lg:relative lg:h-auto lg:w-64 lg:rounded-2xl lg:shadow-md lg:bg-white lg:pt-0`}
      >
        <nav className="p-4 flex flex-col gap-2 w-64 lg:w-full">
          {links[role]?.map((link) => (
            <button
              key={link.key}
              onClick={() => {
                if (link.route) {
                  setIsOpen(false);
                  setActiveTab(link.key);
                  setSearchParams({ tab: link.key });
                  window.history.pushState({}, '', link.route);
                  return;
                }
                setActiveTab(link.key);
                setSearchParams({ tab: link.key });
                setIsOpen(false); // Close menu on mobile
              }}
              className={`w-full text-left px-4 py-2 rounded-xl transition duration-200 font-medium ${
                activeTab === link.key
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 hover:bg-blue-100 text-gray-800"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Backdrop on mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 lg:hidden z-30"
        />
      )}
    </div>
  );
}

export default Sidebar;
