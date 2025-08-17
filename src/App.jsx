import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { CartProvider } from "./context/CartContext.jsx";
import { useCart } from "./context/CartContext.jsx";
import { useSyncCartWithBackend } from "./hooks/useSyncCartWithBackend";

// Components & Pages
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import Shop from "./pages/Shop";
import CategoryDetailsMedicine from "./components/CategoryDetailsMedicine";
import Invoice from "./components/Invoice";
import Dashboard from "./components/dashboard/Dashboard";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import PrivateRoute from "./routes/PrivateRoute";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import UpdateProfile from "./components/UpdateProfile";
import About from "./pages/About";
import Support from "./pages/Support";
import Prescription from "./pages/Prescription";
import MyOrders from "./pages/MyOrders";

function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { cartItems, setCartItems } = useCart();
  useSyncCartWithBackend(user, cartItems, setCartItems);


  const fetchUserData = async (firebaseUidRaw, role = "user") => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");
      // Always use the Firebase UID
      const firebaseUid =
        firebaseUidRaw?.firebaseUid || firebaseUidRaw?.uid || firebaseUidRaw;
      let res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/firebase/${firebaseUid}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 404) {
        // Decode Firebase token to get email and name
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );
        const claims = JSON.parse(jsonPayload);
        const email = claims.email || "unknown@example.com";
        const username = claims.name || email.split("@")[0] || "Unknown";
        const photoURL = claims.picture || "";
        // Create user in backend
        const createRes = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firebaseUid,
            username,
            email,
            photoURL,
            role, // Pass the role dynamically
          }),
        });
        // If 409 (already exists), retry fetch
        if (createRes.status === 409 || createRes.status === 201) {
          res = await fetch(
            `${import.meta.env.VITE_API_URL}/users/firebase/${firebaseUid}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } else {
          throw new Error("Failed to create user in backend");
        }
      }
      if (!res.ok) throw new Error("Failed to fetch user data");
      const data = await res.json();
      data.uid = data.firebaseUid || data.uid || data._id;
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      // Error fetching user data
      handleLogout();
    }
  };


  // Combined user restoration and auth check
  useEffect(() => {
    let didFinish = false;
    const restoreAndCheck = async () => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("access_token");
      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Always use Firebase UID for backend fetch
        const firebaseUid = parsedUser.firebaseUid || parsedUser.uid || parsedUser._id;
        if (firebaseUid) await fetchUserData(firebaseUid, parsedUser.role || "user");
      }
      // Wait for Firebase auth state
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const idToken = await firebaseUser.getIdToken();
            localStorage.setItem("access_token", idToken);
            await fetchUserData(firebaseUser.uid, "user");
          } catch (err) {
            handleLogout();
          }
        } else {
          handleLogout();
        }
        if (!didFinish) {
          setLoading(false);
          didFinish = true;
        }
      });
      // In case onAuthStateChanged never fires (shouldn't happen), fallback after short delay
      setTimeout(() => {
        if (!didFinish) {
          setLoading(false);
          didFinish = true;
        }
      }, 2000);
      return () => unsubscribe();
    };
    restoreAndCheck();
  }, []);

  // Login handler (manual login / signup)
  const handleLogin = (userData) => {
    userData.uid = userData.uid || userData.uid; // ensure uid is present
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout handler
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    // Do not clear cart here
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        user={user}
        onLogout={handleLogout}
        cartCount={cartItems.length}
      />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Shop route only for regular users */}
          {user && user.role === "user" && (
            <>
              <Route
                path="/shop"
                element={
                  <Shop
                    user={user}
                    onAddToCart={(product) => {
                      const exists = cartItems.find((item) => item._id === product._id);
                      if (exists) {
                        setCartItems(cartItems.map((item) => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item));
                      } else {
                        setCartItems([...cartItems, { ...product, quantity: 1 }]);
                      }
                    }}
                  />
                }
              />
              <Route
                path="/cart"
                element={
                  <Cart
                    cartItems={cartItems}
                    onIncrease={(item) => {
                      setCartItems(cartItems.map((i) => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i));
                    }}
                    onDecrease={(item) => {
                      setCartItems(cartItems.map((i) => i._id === item._id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i));
                    }}
                    onRemove={(item) => {
                      setCartItems(cartItems.filter((i) => i._id !== item._id));
                    }}
                    onClear={() => setCartItems([])}
                  />
                }
              />
              <Route
                path="/checkout"
                element={
                  <Checkout
                    cartItems={cartItems}
                    onSuccess={() => setCartItems([])}
                  />
                }
              />
            </>
          )}
          {/* Category details route for all users */}
          <Route
            path="/category/:categoryId"
            element={
              <CategoryDetailsMedicine
                user={user}
                onAddToCart={(product) => {
                  const exists = cartItems.find((item) => item._id === product._id);
                  if (exists) {
                    setCartItems(cartItems.map((item) => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item));
                  } else {
                    setCartItems([...cartItems, { ...product, quantity: 1 }]);
                  }
                }}
              />
            }
          />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/invoice/:paymentId" element={<Invoice />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute user={user} loading={loading}>
                <Dashboard user={user} />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/add-medicine"
            element={
              <PrivateRoute user={user} loading={loading}>
                <Dashboard user={user} />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/new-ad-request"
            element={
              <PrivateRoute user={user} loading={loading}>
                <Dashboard user={user} />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/ad-requests"
            element={
              <PrivateRoute user={user} loading={loading}>
                <Dashboard user={user} />
              </PrivateRoute>
            }
          />
          <Route
            path="/update-profile"
            element={
              <PrivateRoute user={user} loading={loading}>
                <UpdateProfile user={user} onUpdate={setUser} />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login setUser={handleLogin} />} />
          <Route path="/signup" element={<SignUp setUser={handleLogin} />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          <Route path="/prescription" element={<Prescription />} />
          <Route path="/orders" element={<MyOrders user={user} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
