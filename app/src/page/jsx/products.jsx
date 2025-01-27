import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";
import { Swiper, SwiperSlide } from "swiper/react";
import Skeleton from "@mui/material/Skeleton";
import { chunk } from "lodash"; // تأكد من أنك قد قمت بتثبيت lodash عبر npm
import "swiper/css/pagination";
import "swiper/css/effect-cube";
import "swiper/css/effect-cards";
import "swiper/css";
import { EffectCube, Pagination, EffectCards } from "swiper/modules";
import ProductCard from "../../component/jsx/productCard.jsx";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import "../css/products.css";

export default function Products() {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState([]);
  const [top_rating, setTop_rating] = useState([]);
  const [best_price, setBest_price] = useState([]);

  const getProduct = async () => {
    const { data, error } = await supabase.from("product").select("*");
    if (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    } else {
      setProduct(data);
      setLoading(false);
      console.log(data);
    }
  };



  useEffect(() => {
    getProduct();
  }, []);
  useEffect(() => {
    if (product.length > 0) {
      const newProducts = [];
      const topRatedProducts = [];
      const bestPriceProducts = [];

      product.forEach((item) => {
        item.tags.forEach((el) => {
          if (el === "new") newProducts.push(item);
          if (el === "top_rating") topRatedProducts.push(item);
          if (el === "best_price") bestPriceProducts.push(item);
        });
      });

      setNewProduct(newProducts);
      setTop_rating(topRatedProducts);
      setBest_price(bestPriceProducts);
    }
  }, [product]);
  return (
    <>
      <div className="products">
        <div className="home-products">
        {loading ? (
          <Skeleton variant="rounded" width="98%" height={230} />
        ) : (
          <>
            <div className="home-products-content">
              {product.map((el)=>(
                <ProductCard product={el} slide={true} />
              ))}
            </div>
          </>
        )}
      </div>
        <BottomHeader/>
      </div>
    </>
  );
}