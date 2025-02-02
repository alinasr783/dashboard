import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";
import "../css/orders.css";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import Header from "../../component/jsx/header.jsx";
import Skeleton from "@mui/material/Skeleton";
import "@fortawesome/fontawesome-free/css/all.css";
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

export default function Sliders() {
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [options, setOptions] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const getOrders = async () => {
      try {
        const { data, error } = await supabase.from("slider").select("*");

        if (error) {
          setCategory([]);
        } else {
          setCategory(data);
        }
      } catch {
        setCategory([]);
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, [email]);

  const handleOptionsOpen = (id) => {
    setSelectedCategoryId(id);
    setOptions(true);
  };

  const handleOptionsClose = () => {
    setOptions(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addCategory = async () => {
    const { error } = await supabase.from("slider").insert([
      {
        link: title,
        image: image,
      },
    ]);

    if (error) {
      console.error("Failed to add category", error);
    } else {
      setCategory([...category, { name: title, image: image }]);
      handleClose();
    }
  };

  const UpdateCategory = async () => {
    const { error } = await supabase
      .from("slider")
      .update({
        link: title,
        image: image,
      })
      .eq("id", selectedCategoryId);

    if (error) {
      console.error("Failed to update category", error);
    } else {
      setCategory(
        category.map((category) =>
          category.id === selectedCategoryId
            ? { ...category, name: title, image: image }
            : category
        )
      );
      handleOptionsClose();
    }
  };

  const handleDeleteCategory = async () => {
    const { error } = await supabase
      .from("slider")
      .delete()
      .eq("id", selectedCategoryId); // حذف الـ category بناءً على الـ id المحدد

    if (error) {
      console.error("Failed to delete category", error);
    } else {
      setCategory(category.filter((item) => item.id !== selectedCategoryId)); // تحديث الواجهة بإزالة العنصر المحذوف
      handleOptionsClose(); // إغلاق الـ Dialog بعد الحذف
    }
  };

  return (
    <>
      <Header title={"My Sliders"} />
      <div className="orders-content">
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={200} />
        ) : category.length === 0 ? (
          <div className="empty-orders">No sliders found</div>
        ) : (
          <div className="orders-content-items">
            <div className="order-items">
              {category.map((el, index) => (
                <div
                  className="order-item-product"
                  key={index}
                  onClick={() => handleOptionsOpen(el.id)} // النقر العادي لفتح خيارات التحديث
                >
                  <img
                    alt="Product image"
                    height="80"
                    src={`${el.image}`}
                    width="80"
                  />
                  <div className="order-item-details">
                    <h4>{el.link}</h4>
                    <p>
                      create at :{" "}
                      {new Date(el.created_at)
                        .toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })
                        .replace(",", " at")}
                    </p>
                    <p>id : {el.id}</p>
                  </div>
                </div>
              ))}
            </div>
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
        <DialogTitle id="responsive-dialog-title">{"Add New Slider"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill out the required fields
          </DialogContentText>
          {/* Inputs */}
          <form id="add-product-form">
            {/* Title */}
            <div className="input-group">
              <label htmlFor="title">link</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter slider link"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="title">Image</label>
              <input
                type="url"
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Enter Image url"
                required
              />
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Cancel
          </Button>
          <Button onClick={addCategory} autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={options}
        onClose={handleOptionsClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Update Slider"}</DialogTitle>
        <DialogContent>
          {/* Inputs */}
          <form id="add-product-form">
            {/* Title */}
            <div className="input-group">
              <label htmlFor="title">link</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Slider link"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="title">Image</label>
              <input
                type="url"
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Enter Image url"
                required
              />
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOptionsClose} autoFocus>
            Cancel
          </Button>
          <Button onClick={UpdateCategory} autoFocus>
            Save
          </Button>
          <Button onClick={handleDeleteCategory} style={{ color: "white" , background:"red"}} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <BottomHeader />
    </>
  );
}
