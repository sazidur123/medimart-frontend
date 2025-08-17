import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { auth } from "../../firebase";
import { useTranslation } from "react-i18next";
import Sidebar from "./Sidebar";
import AdminHome from "./adminTabs/AdminHome";
import ManageUsers from "./adminTabs/ManageUsers";
import ManageCategories from "./adminTabs/ManageCategories";
import PaymentManagement from "./adminTabs/PaymentManagement";
import SalesReport from "./adminTabs/SalesReport";
import BannerManagement from "./adminTabs/BannerManagement";
import SellerHome from "./sellertabs/SellerHome";
import ManageMedicines from "./sellertabs/ManageMedicines";
import SellerPayments from "./sellertabs/SellerPayments";
import AdRequests from "./sellertabs/AdRequests";
import UserPayments from "./usertabs/UserPayments";


function Dashboard({ user }) {
  const [role, setRole] = useState("user");
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "home";
  const [activeTab, setActiveTab] = useState(initialTab);
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('dashboard.title', 'Dashboard - MediMart');
  }, [t]);
  const [editMedicine, setEditMedicine] = useState(null);

  // Data states
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [payments, setPayments] = useState([]);
  const [sales, setSales] = useState([]);
  const [banners, setBanners] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [adRequests, setAdRequests] = useState([]);
  const [userPayments, setUserPayments] = useState([]);
  const [sellerPayments, setSellerPayments] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("access_token");

  // Sync activeTab with URL query param, avoid navigation loops
  useEffect(() => {
    const urlTab = searchParams.get("tab");
    // Only update activeTab if different from URL
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
      return;
    }
    // For dedicated routes (like add-medicine), override tab
    if (role === "seller" && location.pathname === "/dashboard/add-medicine" && activeTab !== "add-medicine") {
      setActiveTab("add-medicine");
      setSearchParams({ tab: "add-medicine" });
      return;
    }
    if (location.pathname === "/dashboard/ad-requests" && activeTab !== "adRequests") {
      setActiveTab("adRequests");
      setSearchParams({ tab: "adRequests" });
      return;
    }
    // Only update search params if needed and on main dashboard route
    if (activeTab && activeTab !== urlTab && location.pathname === "/dashboard") {
      setSearchParams({ tab: activeTab });
    }
  }, [location.pathname, role, searchParams, activeTab, setSearchParams]);

  // Utility fetch with auth header
  const fetchData = async (url) => {
    let idToken = null;
    if (auth.currentUser) {
      idToken = await auth.currentUser.getIdToken();
    } else {
      idToken = localStorage.getItem("access_token");
    }
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${idToken}` },
    });
    if (!res.ok) {
      // Improved error logging for debugging
      // Failed to fetch from url
      throw new Error(`Failed to fetch from ${url}`);
    }
    return res.json();
  };

  // Set role from user prop
  useEffect(() => {
    setRole(user?.role || "user");
  }, [user]);

  // Fetch data on role or user ID change
  useEffect(() => {
    let isMounted = true;
    setError(null);
    setLoading(true);

    // Don't fetch if user is not loaded yet
    if ((role === "user") && !(user?._id || user?.uid)) {
      setLoading(false);
      return;
    }

    const fetchAdminData = async () => {
      try {
        if (!isMounted) return;
        const [
          statsData,
          usersData,
          categoriesData,
          paymentsData,
          salesData,
          bannersData,
        ] = await Promise.all([
          fetchData(`${import.meta.env.VITE_API_URL}/admin/stats`),
          fetchData(`${import.meta.env.VITE_API_URL}/users`),
          fetchData(`${import.meta.env.VITE_API_URL}/categories`),
          fetchData(`${import.meta.env.VITE_API_URL}/payments`),
          fetchData(`${import.meta.env.VITE_API_URL}/sales/sales`),
          fetchData(`${import.meta.env.VITE_API_URL}/banners/all`),
        ]);
        if (!isMounted) return;
        setStats(statsData);
        setUsers(usersData);
        setCategories(categoriesData);
        setPayments(paymentsData);
        // Transform salesData to flat rows for SalesReport
        const salesRows = [];
        salesData.forEach((payment) => {
          payment.items.forEach((item) => {
            const sellerEmail = item.product?.seller?.email;
            const buyerEmail = payment.user?.email;
            if (sellerEmail && buyerEmail) {
              salesRows.push({
                _id: payment._id + '-' + (item.product?._id || ''),
                medicine: item.product?.name || '-',
                seller: sellerEmail,
                buyer: buyerEmail,
                total: ((item.price || 0) * (item.quantity || 1)).toFixed(2),
                date: payment.date ? new Date(payment.date).toLocaleDateString() : '-',
              });
            }
          });
        });
        setSales(salesRows);
        setBanners(bannersData);
      } catch (err) {
        if (!isMounted) return;
        setError("Failed to load admin data");
        // Admin data fetch error
      }
    };

    const fetchSellerData = async () => {
      try {
        if (!isMounted) return;
        const [
          statsData,
          medicinesData,
          sellerPaymentsData,
          adRequestsData,
          categoriesData,
        ] = await Promise.all([
          fetchData(`${import.meta.env.VITE_API_URL}/seller/stats`),
          fetchData(`${import.meta.env.VITE_API_URL}/medicines`),
          fetchData(`${import.meta.env.VITE_API_URL}/seller/payments`),
          fetchData(`${import.meta.env.VITE_API_URL}/ads`),
          fetchData(`${import.meta.env.VITE_API_URL}/categories`),
        ]);
        if (!isMounted) return;
        setStats(statsData);
        setMedicines(medicinesData);
        setSellerPayments(sellerPaymentsData);
        setAdRequests(adRequestsData);
        setCategories(categoriesData);
      } catch (err) {
        if (!isMounted) return;
        setError("Failed to load seller data");
        // Error
      }
    };

    const fetchUserData = async () => {
      try {
        if (!isMounted) return;
        const userPaymentsData = await fetchData(
          `${import.meta.env.VITE_API_URL}/users/payments/${user?._id || user?.uid}`
        );
        if (!isMounted) return;
        setUserPayments(userPaymentsData);
      } catch (err) {
        if (!isMounted) return;
        setError("Failed to load user data");
        // Error
      }
    };

    if (role === "admin") {
      fetchAdminData().finally(() => isMounted && setLoading(false));
    } else if (role === "seller") {
      fetchSellerData().finally(() => isMounted && setLoading(false));
    } else {
      fetchUserData().finally(() => isMounted && setLoading(false));
    }

    return () => {
      isMounted = false;
    };
  }, [role, user?._id, user?.uid]);

  // Route override for dedicated ad request page
  if (location.pathname === "/dashboard/ad-requests") {
    setTimeout(() => setActiveTab("adRequests"), 0);
  }

  // Render content for current tab & role
  const renderContent = () => {
    if (loading) return <p className="text-center mt-8">Loading...</p>;
    if (error) return <p className="text-center text-red-600 mt-8">{error}</p>;

    if (role === "admin") {
      switch (activeTab) {
        case "home":
          return <AdminHome stats={stats} />;
        case "users":
          return <ManageUsers users={users} setUsers={setUsers} showSellerRequests={true} />;
        case "categories":
          return (
            <ManageCategories
              categories={categories}
              setCategories={setCategories}
            />
          );
        case "payments":
          return (
            <PaymentManagement payments={payments} setPayments={setPayments} />
          );
        case "sales":
          return <SalesReport sales={sales} />;
        case "banners":
          return (
            <BannerManagement banners={banners} setBanners={setBanners} medicines={medicines} currentUserId={user?._id} />
          );
        default:
          return null;
      }
    } else if (role === "seller") {
      switch (activeTab) {
        case "home":
          return <SellerHome stats={stats} />;
        case "medicines":
          return (
            <ManageMedicines
              medicines={medicines}
              setMedicines={setMedicines}
              user={user}
              categories={categories}
              setActiveTab={setActiveTab}
              setEditMedicine={setEditMedicine}
            />
          );
        case "sellerPayments":
          return <SellerPayments sellerPayments={sellerPayments} />;
        case "adRequests":
          return (
            <AdRequests adRequests={adRequests} setAdRequests={setAdRequests} user={user} />
          );
        case "add-medicine":
          // AddMedicine is now a modal in ManageMedicines; fallback to medicines tab
          return (
            <ManageMedicines
              medicines={medicines}
              setMedicines={setMedicines}
              user={user}
              categories={categories}
              setActiveTab={setActiveTab}
            />
          );
        default:
          return null;
      }
    } else {
      // user role
      return <UserPayments userPayments={userPayments} user={user} token={token} />;
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col md:flex-row">
      <aside className="md:h-screen md:w-64 p-4 border-r bg-base-100">
        <Sidebar role={role} activeTab={activeTab} setActiveTab={setActiveTab} setSearchParams={setSearchParams} />
      </aside>
      <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
    </div>
  );
}

export default Dashboard;
