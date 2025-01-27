import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { HeartColored, WishlistActive } from "./icons";
import "../css/productCard.css";
import "swiper/css";

export default function ProductCard({ product, slide }) {
  const [love, setLove] = useState(false);
  const navigate = useNavigate();

  const updateViewers = async (id) => {
    const { data, error } = await supabase
      .from("product")
      .update({ viewer: product.viewer + 1 })
      .eq("id", id);

    if (error) {
      console.error("Error updating product viewers:", error);
    } else {
      console.log("Product viewers updated successfully:", data);
    }
  };

  const handleClick = () => {
    updateViewers(product.id);
    navigate(`/product/${product.id}`);
  };

  const handleHeart = (e) => {
    e.stopPropagation(); // منع حدث onClick للعنصر الخارجي
    setLove((prevLove) => !prevLove);
  };

  // التحقق من وجود الصور
  if (!product || !product.images || product.images.length === 0) {
    return <div>Error: Product images are missing.</div>;
  }

  return (
    <div className="product-card" onClick={handleClick}>
      <div className="product-card-content">
        <div className="product-card-content-image">
          {slide ? (
            <Swiper className="product-card-content-sliders">
              {product.images.map((el, ind) => (
                <SwiperSlide className="product-card-content-slider" key={ind}>
                  <img src={el} alt={`Product ${ind}`} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <img src={product.images[0]} alt="Product" />
          )}
        </div>
        <div className="product-card-content-top">
          <div className="product-card-content-title">{product.title}</div>
          <div className="product-card-content-rating">
            <i className="fa fa-star"></i>
            <div className="product-card-content-rating-number">{product.rating}</div>
          </div>
        </div>
        <div className="product-card-content-bottom">
          <div className="product-card-content-price">${product.price}</div>
        </div>
        <div className="product-card-content-heart" onClick={handleHeart}>
          <div
            className="product-card-content-heart-icon"
            dangerouslySetInnerHTML={{ __html: love ? WishlistActive : HeartColored }}
          />
        </div>
      </div>
    </div>
  );
}