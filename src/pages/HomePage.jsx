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

// --- Modern, Responsive Extra Sections ---

function FAQSection() {
  return (
    <section className="mt-4 lg:pl-10 lg:pr-10">
      <div className="w-full rounded-2xl p-4 sm:p-8 bg-gradient-to-br from-purple-50 via-white to-blue-50 shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 text-purple-700 text-center tracking-tight drop-shadow">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4 max-w-2xl mx-auto">
          <details className="bg-white rounded-xl shadow p-4 group transition-all">
            <summary className="font-semibold cursor-pointer text-primary group-open:text-purple-700 transition-colors">
              How do I place an order?
            </summary>
            <p className="mt-2 text-gray-600">
              Simply browse our products, add items to your cart, and proceed to checkout. You can pay securely online.
            </p>
          </details>
          <details className="bg-white rounded-xl shadow p-4 group transition-all">
            <summary className="font-semibold cursor-pointer text-primary group-open:text-purple-700 transition-colors">
              What payment methods are accepted?
            </summary>
            <p className="mt-2 text-gray-600">
              We accept all major credit/debit cards and secure online payments via Stripe.
            </p>
          </details>
          <details className="bg-white rounded-xl shadow p-4 group transition-all">
            <summary className="font-semibold cursor-pointer text-primary group-open:text-purple-700 transition-colors">
              How fast is delivery?
            </summary>
            <p className="mt-2 text-gray-600">
              Most orders are delivered within 2-5 business days, depending on your location.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="mt-4 lg:pl-10 lg:pr-10">
      <div className="w-full rounded-2xl p-4 sm:p-8 bg-gradient-to-br from-green-50 via-white to-blue-50 shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 text-green-700 text-center tracking-tight drop-shadow">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-xl">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sarah K." className="w-16 h-16 rounded-full mb-3 object-cover" />
            <p className="text-gray-700 mb-2">"Great service and fast delivery!"</p>
            <span className="font-semibold text-primary">- Sarah K.</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-xl">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Ahmed R." className="w-16 h-16 rounded-full mb-3 object-cover" />
            <p className="text-gray-700 mb-2">"Wide range of medicines at good prices."</p>
            <span className="font-semibold text-primary">- Ahmed R.</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-xl">
            <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Emily T." className="w-16 h-16 rounded-full mb-3 object-cover" />
            <p className="text-gray-700 mb-2">"Easy to use website and helpful support."</p>
            <span className="font-semibold text-primary">- Emily T.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  return (
    <section className="mt-4 lg:pl-10 lg:pr-10">
      <div className="w-full rounded-2xl p-4 sm:p-8 bg-gradient-to-br from-indigo-50 via-white to-pink-50 shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 text-indigo-700 text-center tracking-tight drop-shadow">
          Subscribe to Our Newsletter
        </h2>
        <form className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-2xl mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="input input-bordered w-full sm:w-auto flex-1"
          />
          <button className="btn btn-primary w-full sm:w-auto">Subscribe</button>
        </form>
        <p className="text-xs text-gray-500 text-center mt-4">
          Get the latest updates, offers, and health tips delivered to your inbox.
        </p>
      </div>
    </section>
  );
}

// --- End Modern Sections ---

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
    <main>
      <div>
        <BannerSlider banners={banners} />
        <CategorySection categories={categories} />
        <DiscountProductsSection products={discountProducts} onAddToCart={handleAddToCart} />
        <FAQSection />
        <TestimonialsSection />
        <NewsletterSection />
        <HealthTipsSection />
        <PartnersSection />
        <HomeStatsSection />
      </div>
    </main>
  );
}

export default HomePage;
