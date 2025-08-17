import { useEffect, useState } from "react";

export default function useCategoryName(categoryId) {
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (!categoryId) return;
    const fetchCategory = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
        const data = await res.json();
        const found = data.find((cat) => cat._id === categoryId);
        setCategoryName(found ? found.name : categoryId);
      } catch {
        setCategoryName(categoryId);
      }
    };
    fetchCategory();
  }, [categoryId]);

  return categoryName;
}
