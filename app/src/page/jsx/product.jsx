import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BottomHeader from "../../component/jsx/bottomHeader";
import ProductSlider from "../../component/jsx/productSlider";
import { WhiteCart, OrdersActive, CartActive,WishlistActive,Money, UsersIcon } from "../../component/jsx/icons";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ProductCard from "../../component/jsx/productCard.jsx";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { supabase } from "../../lib/supabase.js";
import "../css/product.css";

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [des, setDes] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");
  const [sizes, setSizes] = useState([""]);
  const [colors, setColors] = useState([{ url: "", color: "" }]);
  const [images, setImages] = useState([""]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [open, setOpen] = useState(false);
  const [editValues, setEditValues] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from("product")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        setProduct(data);
        setEditValues({
          title: data.title,
          description: data.description,
          price: data.price,
          rating: data.rating,
          sizes: data.sizes || [""],
          colors: data.colors || [{ url: "", color: "" }],
          images: data.images || [""],
          categoryId: data.categoryId || null,
        });
      } catch (error) {
        console.error("Error fetching product:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const updateProduct = async () => {
    try {
      // تحقق من أن القيم الأساسية غير فارغة
      if (!editValues.title || !editValues.description || !editValues.price || !editValues.rating) {
        alert("Please fill in all required fields.");
        return;
      }

      const { data, error } = await supabase
        .from("product")
        .update({
          title: editValues.title,
          des: editValues.description,
          price: editValues.price,
          rating: editValues.rating,
          sizes: editValues.sizes,
          colors: editValues.colors,
          images: editValues.images,
          category: editValues.categoryId,
        })
        .eq("id", product.id);

      if (error) {
        console.error("Error updating product:", error.message);
        alert("Failed to update product. Please try again.");
      } else {
        alert("Product updated successfully!");
        handleClose();
        fetchProduct(); // لإعادة جلب المنتج بعد التحديث
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSizeChange = (index, value) => {
    const updatedSizes = [...sizes];
    updatedSizes[index] = value;
    if (value && index === updatedSizes.length - 1) {
      setSizes([...updatedSizes, ""]); // Add a new size field
    } else {
      setSizes(updatedSizes);
    }
  };

  const handleColorChange = (index, key, value) => {
    const updatedColors = [...colors];
    updatedColors[index][key] = value;

    if (updatedColors[index].url && updatedColors[index].color && index === updatedColors.length - 1) {
      setColors([...updatedColors, { url: "", color: "" }]); // Add a new color field
    } else {
      setColors(updatedColors);
    }
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...images];
    updatedImages[index] = value;

    if (value && index === updatedImages.length - 1) {
      setImages([...updatedImages, ""]); // Add a new image field
    } else {
      setImages(updatedImages);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpenEditDialog(false); // غلق الـ Dialog
  };

  const getCategories = async () => {
    try {
      const { data, error } = await supabase.from("category").select("*");
      if (error) {
        console.error("Error fetching categories:", error);
      } else {
        setCategories(data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleEditOpen = () => {
    console.log('Editing product...', product);  // هذا سيساعدك في معرفة إذا كانت قيم المنتج صحيحة
    setEditValues(product);
    setOpenEditDialog(true);
  };


  const deleteProduct = async (id) => {
    try {
      const { data, error } = await supabase
        .from("product")
        .delete()
        .eq("id", id);

      if (error) throw error;

      console.log("Product deleted successfully:", data);
      navigate("/products");
    } catch (error) {
      console.error("Error deleting product:", error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found!</div>;
  }
  return (
    <div className="product-p">

      <div className="product">
        <div className="overwrite">
          <div className="overwrite-content">
            <div className="overwrite-content-cards">
              {/* Existing Cards */}
              <div className="overwrite-content-cards-card">
                <div className="overwrite-content-cards-card-icon">
                  <div
                    className={`heart-icon`}
                    dangerouslySetInnerHTML={{
                      __html: OrdersActive,
                    }}
                  />
                </div>
                <div className="overwrite-content-cards-card-content">
                  <div className="overwrite-content-cards-card-content-value">
                    <i className="fa fa-plus"></i>
                    {product.orders}
                  </div>
                  <div className="overwrite-content-cards-card-content-title">
                    Orders
                  </div>
                </div>
              </div>
              <div className="overwrite-content-cards-card">
                <div className="overwrite-content-cards-card-icon">
                  <div
                    className={`heart-icon`}
                    dangerouslySetInnerHTML={{
                      __html: CartActive,
                    }}
                  />
                </div>
                <div className="overwrite-content-cards-card-content">
                  <div className="overwrite-content-cards-card-content-value">
                    <i className="fa fa-plus"></i>
                    {product.added_cart}
                  </div>
                  <div className="overwrite-content-cards-card-content-title">
                    Cart Added
                  </div>
                </div>
              </div>
              <div className="overwrite-content-cards-card">
                <div className="overwrite-content-cards-card-icon">
                  <div
                    className={`heart-icon`}
                    dangerouslySetInnerHTML={{
                      __html: WishlistActive,
                    }}
                  />
                </div>
                <div className="overwrite-content-cards-card-content">
                  <div className="overwrite-content-cards-card-content-value">
                    <i className="fa fa-plus"></i>
                    {product.added_wishlist}
                  </div>
                  <div className="overwrite-content-cards-card-content-title">
                    Wishlist Added
                  </div>
                </div>
              </div>
              <div className="overwrite-content-cards-card">
                <div className="overwrite-content-cards-card-icon">
                  <div
                    className={`heart-icon`}
                    dangerouslySetInnerHTML={{
                      __html: Money,
                    }}
                  />
                </div>
                <div className="overwrite-content-cards-card-content">
                  <div className="overwrite-content-cards-card-content-value">
                    <i className="fa fa-plus"></i>
                    {product.orders * product.price } EGP
                  </div>
                  <div className="overwrite-content-cards-card-content-title">
                    Sales
                  </div>
                </div>
              </div>
              <div className="overwrite-content-cards-card">
                <div className="overwrite-content-cards-card-icon">
                  <div
                    className={`heart-icon`}
                    dangerouslySetInnerHTML={{
                      __html: UsersIcon,
                    }}
                  />
                </div>
                <div className="overwrite-content-cards-card-content">
                  <div className="overwrite-content-cards-card-content-value">
                    <i className="fa fa-plus"></i>
                    {product.viewer}
                  </div>
                  <div className="overwrite-content-cards-card-content-title">
                    Viewers
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="product-btns-actions">
        <div className="product-btns-actions-content">
          <button className="product-btn-edit" onClick={handleEditOpen}>
            Edit Product
          </button>
          <button
            className="product-btn-delete"
            onClick={() => deleteProduct(product.id)}
          >
            Delete Product
          </button>
        </div>
      </div>
      <BottomHeader />

      {/* Dialog */}
      <Dialog
        fullScreen={fullScreen}
        open={openEditDialog}  // تأكد أن هذه هي التي تتحكم في الظهور
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Edit Product"}</DialogTitle>
        <DialogContent>
          <DialogContentText>Fill out the required fields to edit the product</DialogContentText>
          <form id="edit-product-form">
            <div className="input-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={editValues?.title || ""}
                onChange={handleInputChange}
                placeholder="Enter product title"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                value={editValues?.des || ""}
                onChange={handleInputChange}
                placeholder="Enter product description"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={editValues?.price || ""}
                onChange={handleInputChange}
                placeholder="Enter product price"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="rating">Rating</label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={editValues?.rating || ""}
                onChange={handleInputChange}
                placeholder="Enter product rating"
                min="0"
                max="5"
                step="0.1"
                required
              />
            </div>

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
                getOptionLabel={(option) => option.name}
                value={categories.find((category) => category.id === categoryId) || null}
                onChange={(event, newValue) => setCategoryId(newValue ? newValue.id : null)}
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
          <Button onClick={updateProduct} autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}