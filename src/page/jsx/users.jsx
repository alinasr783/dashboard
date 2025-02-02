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

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

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
          </>
        )}
      </div>
      <BottomHeader />
    </>
  );
}