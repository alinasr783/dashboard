import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";
import "../css/orders.css";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import Header from "../../component/jsx/header.jsx";
import Skeleton from "@mui/material/Skeleton";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(null);


  useEffect(() => {
    const getOrders = async () => {
        try {
          const { data, error } = await supabase
            .from("order")
            .select("*")

          if (error) {
            setOrders([]);
          } else {
            setOrders(data);
          }
        } catch {
          setOrders([]);
        } finally {
          setLoading(false);
        }
      }
    getOrders();
  }, [email]);

  const handleViewOrder = (orderId, orderData) => {
    navigate(`/order/${orderId}`, { state: { order: orderData } });
  };

  

  return (
    <>
      <Header title={"My Orders"} />
      <div className="orders-content">
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={200} />
        ) : orders.length === 0 ? (
          <div className="empty-orders">No orders found</div>
        ) : (
          <div className="orders-content-items">
            <div className="order-items">
              {orders.map((el, index) => (
                <div
                  className="order-item-product"
                  key={index}
                  onClick={() => handleViewOrder(el.id, el)}
                >
                  <img
                    alt="Product image"
                    height="80"
                    src={`${el.products[0].img}`}
                    width="80"
                  />
                  <div className="order-item-details">
                    <h4>{el.products[0].title}</h4>
                    <p>state : {el.state}</p>
                    <strong>total price : {el.total_price} EGP</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <BottomHeader />
    </>
  );
}