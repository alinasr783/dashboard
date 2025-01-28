import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase.js";
import Skeleton from "@mui/material/Skeleton";
import "@fortawesome/fontawesome-free/css/all.css";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ProductCard from "../../component/jsx/productCard.jsx";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import "../css/products.css";

export default function Products() {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState([]);
  const [top_rating, setTop_rating] = useState([]);
  const [best_price, setBest_price] = useState([]);
  const [title, setTitle] = useState("");
  const [des, setDes] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");
  const [sizes, setSizes] = useState([""]);
  const [colors, setColors] = useState([{ url: "", color: "" }]);
  const [images, setImages] = useState([""]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null); // لتخزين id للـ category المختار

  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const getCategories = async () => {
    try {
      const { data, error } = await supabase.from("category").select("*");
      if (error) {
        console.error("Error fetching categories:", error);
      } else {
        setCategories(data); // تخزين الـ categories في الحالة
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  useEffect(() => {
    getCategories(); // استدعاء الدالة لتحميل الـ categories عند تحميل الصفحة
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getProduct = async () => {
    try {
      const { data, error } = await supabase.from("product").select("*");
      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProduct(data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSizeChange = (index, value) => {
    if (!sizes) return;
    const updatedSizes = [...sizes];
    updatedSizes[index] = value;
    setSizes(updatedSizes);

    // إضافة حقل جديد إذا كان الحقل الحالي ليس فارغًا
    if (value !== "" && index === updatedSizes.length - 1) {
      setSizes([...updatedSizes, ""]);
    }
  };

  const handleColorChange = (index, key, value) => {
    if (!colors) return;
    const updatedColors = [...colors];
    updatedColors[index][key] = value;
    setColors(updatedColors);

    // إضافة حقل جديد إذا كان الحقل الحالي مكتملًا
    if (
      updatedColors[index].url !== "" &&
      updatedColors[index].color !== "" &&
      index === updatedColors.length - 1
    ) {
      setColors([...updatedColors, { url: "", color: "" }]);
    }
  };

  const handleImageChange = (index, value) => {
    if (!images) return;
    const updatedImages = [...images];
    updatedImages[index] = value;
    setImages(updatedImages);

    // إضافة حقل جديد إذا كان الحقل الحالي ليس فارغًا
    if (value !== "" && index === updatedImages.length - 1) {
      setImages([...updatedImages, ""]);
    }
  };



  useEffect(() => {
    getProduct();
  }, []);

  useEffect(() => {
    if (product && product.length > 0) {
      const newProducts = [];
      const topRatedProducts = [];
      const bestPriceProducts = [];

      product.forEach((item) => {
        item.tags && item.tags.forEach((el) => {
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

  const addProduct = async () => {
    try {
      // التأكد من أن الحقول ليست فارغة
      if (!title || !des || !price || !rating) {
        alert("Please fill in all required fields.");
        return;
      }

      const newProduct = {
        title,
        des,
        price: Number(price),
        rating: Number(rating),
        sizes: sizes.filter(size => size.trim() !== ""), // تصفية الحقول الفارغة
        colors: colors.filter(color => color.url.trim() !== "" && color.color.trim() !== ""), // تصفية الحقول الفارغة
        images: images.filter(image => image.trim() !== ""), // تصفية الحقول الفارغة
      };

      if (!newProduct.sizes.length || !newProduct.colors.length || !newProduct.images.length) {
        alert("Please provide valid sizes, colors, and images.");
        return;
      }

      const { data, error } = await supabase.from("product").insert([newProduct]);

      if (error) {
        console.error("Error adding product:", error.message);
        alert("Failed to add product. Please try again.");
      } else {
        alert("Product added successfully!");
        handleClose();
        getProduct();
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <>
      <div className="products">
        <div className="home-products">
          {loading ? (
            <Skeleton variant="rounded" width="98%" height={230} />
          ) : (
            <div className="home-products-content">
              {product.map((el) => (
                <ProductCard key={el.id} product={el} slide={true} />
              ))}
            </div>
          )}
        </div>
        <div className="add-product" onClick={handleClickOpen}>
          <i className="fa fa-plus"></i>
        </div>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{"Add New Product"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Fill out the required fields
            </DialogContentText>
            {/* Inputs */}
            <form id="add-product-form">
              {/* Title */}
              <div className="input-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter product title"
                  required
                />
              </div>

              {/* Description */}
              <div className="input-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  id="description"
                  value={des}
                  onChange={(e) => setDes(e.target.value)}
                  placeholder="Enter product description"
                  required
                />
              </div>

              {/* Price */}
              <div className="input-group">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter product price"
                  required
                />
              </div>

              {/* Rating */}
              <div className="input-group">
                <label htmlFor="rating">Rating</label>
                <input
                  type="number"
                  id="rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  placeholder="Enter product rating"
                  min="0"
                  max="5"
                  step="0.1"
                  required
                />
              </div>

              {/* Sizes */}
              <div className="input-group">
                <label>Sizes</label>
                {sizes.map((size, index) => (
                  <input
                    key={index}
                    type="text"
                    value={size}
                    onChange={(e) => handleSizeChange(index, e.target.value)}
                    placeholder="Enter a size (e.g., M, XL)"
                  />
                ))}
              </div>

              {/* Colors */}
              <div className="input-group">
                <label>Colors</label>
                {colors.map((colorObj, index) => (
                  <div key={index} style={{ marginBottom: "10px" }}>
                    <input
                      type="text"
                      value={colorObj.url}
                      onChange={(e) => handleColorChange(index, "url", e.target.value)}
                      placeholder="Image URL"
                    />
                    <input
                      type="text"
                      value={colorObj.color}
                      onChange={(e) => handleColorChange(index, "color", e.target.value)}
                      placeholder="Color Name"
                    />
                  </div>
                ))}
              </div>

              {/* Images */}
              <div className="input-group">
                <label>Images</label>
                {images.map((image, index) => (
                  <input
                    key={index}
                    type="text"
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="Enter an image URL"
                  />
                ))}
              </div>

              <div className="input-group">
                <label>Category</label>
                <Autocomplete
                  options={categories}
                  getOptionLabel={(option) => option.name} // عرض الاسم
                  onChange={(event, newValue) => setCategoryId(newValue ? newValue.id : null)} // تخزين id للـ category المختار
                  renderInput={(params) => (
                    <TextField {...params} label="Select Category" variant="outlined" />
                  )}
                />
              </div>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              Cancel
            </Button>
            <Button onClick={addProduct} autoFocus>
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <BottomHeader />
      </div>
    </>
  );
}