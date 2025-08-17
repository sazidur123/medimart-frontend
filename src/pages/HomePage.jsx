import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext.jsx";
import { useQuery } from "@tanstack/react-query";
import { auth } from "../firebase";
import { onAuthStateChanged, getIdToken } from "firebase/auth";
import BannerSlider from "../components/BannerSlider";
import CategorySection from "../components/CategorySection";
import DiscountProductsSection from "../components/DiscountProductsSection";
import HealthTipsSection from "../components/HealthTipsSection";
import PartnersSection from "../components/PartnersSection";
import HomeStatsSection from "../components/HomeStatsSection.jsx";

function HomePage() {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('home.title', 'Home - MediMart');
  }, [t]);
  const { cartItems, setCartItems } = useCart();
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await getIdToken(user);
        setUserToken(token);
      } else {
        setUserToken(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const { data: banners = [], isLoading: bannersLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/banners`);
      if (!res.ok) throw new Error("Failed to fetch banners");
      return res.json();
    },
  });
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
      return res.json();
    },
  });
  const [discountProducts, setDiscountProducts] = useState([]);

  useEffect(() => {
    const fetchDiscountProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/products/discounted?limit=10`);
        if (!res.ok) throw new Error("Failed to fetch discounted products");
        const data = await res.json();
        setDiscountProducts(data);
      } catch {
        setDiscountProducts([]);
      }
    };
    fetchDiscountProducts();
  }, []);

  // Handler to add product to cart
  const handleAddToCart = (product) => {
    const exists = cartItems.find((item) => item._id === product._id);
    if (exists) {
      setCartItems(
        cartItems.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  return (
    <main className="">
      <div className="">
        <BannerSlider banners={banners} />
        <CategorySection categories={categories} />
        <DiscountProductsSection products={discountProducts} onAddToCart={handleAddToCart} />
        <HealthTipsSection />
        <PartnersSection />
        <HomeStatsSection />
      </div>
    </main>
  );
}

export default HomePage;
