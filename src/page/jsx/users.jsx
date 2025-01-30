import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";
import "../css/orders.css";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import Header from "../../component/jsx/header.jsx";
import Skeleton from "@mui/material/Skeleton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Orders() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [sliderInputs, setSliderInputs] = useState([{ url: "", link: "" }]);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const getOrders = async () => {
      try {
        const { data, error } = await supabase
          .from("identity")
          .select("*");

        if (error) {
          setUsers([]);
        } else {
          setUsers(data);
        }
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  const handleViewOrder = (orderId, orderData) => {
    navigate(`/order/${orderId}`, { state: { order: orderData } });
  };

  const handleSliderChange = (index, key, value) => {
    const updatedSlider = [...sliderInputs];
    updatedSlider[index][key] = value;

    if (
      updatedSlider[index].url &&
      updatedSlider[index].link &&
      index === updatedSlider.length - 1
    ) {
      updatedSlider.push({ url: "", link: "" });
    }

    setSliderInputs(updatedSlider);
  };

  const addProduct = async () => {
    try {
      // تصفية الحقول الفارغة
      const sliderData = sliderInputs
        .filter(item => item.url.trim() !== "" && item.link.trim() !== "") // تصفية الحقول الفارغة
        .map(item => ({
          image: item.url,
          link: item.link.startsWith('/') ? item.link : `/${item.link}`
        }));

      // التحقق من وجود بيانات صالحة
      if (sliderData.length === 0) {
        alert("Please fill in at least one valid slider.");
        return;
      }

      // إرسال البيانات
      const { data, error } = await supabase
        .from('slider')
        .insert(sliderData);

      if (error) throw error;

      handleClose();
      alert('Sliders added successfully!');
      // إعادة تحميل البيانات أو تحديث الواجهة

    } catch (error) {
      console.error('Error adding sliders:', error);
      alert('Failed to add sliders');
    }
  };

  return (
    <>
      <Header title={"My Users"} />
      <div className="orders-content">
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={200} />
        ) : users.length === 0 ? (
          <div className="empty-orders">No orders found</div>
        ) : (
          <>
            <div className="orders-content-items">
              <div className="order-items">
                {users.map((el, index) => (
                  <div
                    className="order-item-product"
                    key={index}
                    onClick={() => handleViewOrder(el.id, el)}
                  >
                    <img
                      alt="Product image"
                      height="80"
                      src={`https://i.ibb.co/0jmVVsH/IMG-20241215-WA0005.jpg`}
                      width="80"
                    />
                    <div className="order-item-details">
                      <h4>{el.fullName ? el.fullName : "User Name"}</h4>
                      <p>phone : {el.phone}</p>
                      <p>email : {el.email}</p>
                      <p>
                        create at : {new Date(el.created_at).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        }).replace(",", " at")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
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
              <DialogTitle id="responsive-dialog-title">{"Add Sliders"}
              </DialogTitle>
              <DialogContent>
                {/* Slider Images */}
                <div className="input-group">
                  <label>Slider Images</label>
                  {sliderInputs.map((slider, index) => (
                    <div key={index} style={{ marginBottom: "10px" }}>
                      <input
                        type="text"
                        value={slider.url}
                        onChange={(e) => handleSliderChange(index, "url", e.target.value)}
                        placeholder="Image URL"
                      />
                      <input
                        type="text"
                        value={slider.link}
                        onChange={(e) => handleSliderChange(index, "link", e.target.value)}
                        placeholder="Link (e.g. product)"
                      />
                    </div>
                  ))}
                </div>
              </DialogContent>
              <DialogActions>
                <button className="cancel-button" onClick={handleClose}>Cancel</button>
                <button className="add-button" onClick={addProduct}>Add Sliders</button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </div>
      <BottomHeader />
    </>
  );
}