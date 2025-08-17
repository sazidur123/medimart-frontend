import { useEffect } from "react";
import { auth } from "../firebase";

export function useSyncCartWithBackend(user, cartItems, setCartItems) {
  useEffect(() => {
    if (!user || !user._id || user.role !== "user") return;
    // Fetch cart from backend on login
    const fetchCart = async () => {
      let token = null;
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      } else {
        token = localStorage.getItem("access_token");
      }
      const res = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.items) {
          setCartItems(
            data.items.map((item) => ({
              ...item.product,
              quantity: item.quantity,
            }))
          );
        }
      }
    };
    fetchCart();
    // eslint-disable-next-line
  }, [user && user._id]);

  useEffect(() => {
    if (!user || !user._id || user.role !== "user") return;
    // Save cart to backend on change
    const saveCart = async () => {
      let token = null;
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      } else {
        token = localStorage.getItem("access_token");
      }
      await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
        }),
      });
    };
    saveCart();
    // eslint-disable-next-line
  }, [cartItems, user && user._id]);
}
