import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Header from "../../component/jsx/header.jsx";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import "../css/order.css";

const steps = [
  "Order Read",
  "Order Under Review",
  "Order In Transit",
  "Order Delivered",
];

export default function Order() {
  const { id } = useParams();
  const location = useLocation();
  const { order } = location.state || {};
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState(order?.state || steps[0]);
  const [selectedStep, setSelectedStep] = useState(steps.indexOf(order?.state || steps[0]) + 1);

  useEffect(() => {
    if (!order) {
      navigate("/orders");
    }
  }, [order, navigate]);

  const handleSaveState = async () => {
    try {
      const { error } = await supabase
        .from("order")
        .update({
          state: selectedState,
          step: selectedStep,
        })
        .eq("id", id);

      if (error) {
        console.error("Failed to update order state", error);
      } else {
        console.log("Order state updated successfully");
        navigate("/orders");
      }
    } catch (err) {
      console.error("Error saving order state", err);
    }
  };

  return (
    <>
      <Header title={"Order Tracker"} back={"/orders"} />

      <div className="orders-content">
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={200} />
        ) : (
          order && (
            <>
              <div className="order-content-items">
                <div className="order-items">
                  {order.products.map((product, index) => (
                    <div className="order-item-product" key={index}>
                      <img
                        alt="Product image"
                        height="80"
                        src={product.img}
                        width="80"
                      />
                      <div className="cart-item-details">
                        <h4>{product.title}</h4>
                        <p>Size : {product.size} , Color : {product.color}</p>
                        <p>Price : {product.price} EGP</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-details-wrapper">
                <div className="order-details-content">
                  <div className="section-title">User Details</div>
                  <div className="details-item">
                    <span className="details-label">Full Name:</span>
                    <span className="details-value">{order.full_name}</span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Phone:</span>
                    <span className="details-value">{order.phone}</span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Address:</span>
                    <span className="details-value">{order.address}</span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">City:</span>
                    <span className="details-value">{order.city}</span>
                  </div>
                  {order.email && (
                    <div className="details-item">
                      <span className="details-label">Email:</span>
                      <span className="details-value">{order.email}</span>
                    </div>
                  )}
                </div>

                <div className="order-details-content">
                  <div className="section-title">Order Details</div>
                  <div className="details-item">
                    <span className="details-label">Total Price:</span>
                    <span className="details-value">{order.total_price} EGP</span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Status:</span>
                    <span className="details-value">{order.state}</span>
                  </div>
                </div>
              </div>

              <div className="order-steper">
                <div className="order-steper-content">
                  <div className="order-steper-content-title">Order Status</div>
                  <div className="order-steper-content-steps">
                    <Box sx={{ width: "80%" }}>
                      <Stepper
                        activeStep={steps.indexOf(selectedState)}
                        orientation="vertical"
                      >
                        {steps.map((label, index) => (
                          <Step key={index} completed={index + 1 < selectedStep}>
                            <StepLabel>
                              <div className="step-text">{label}</div>
                            </StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    </Box>
                  </div>
                </div>
                <div className="order-steper-actions">
                  <Autocomplete
                    value={selectedState}
                    onChange={(event, newValue) => {
                      setSelectedState(newValue);
                      setSelectedStep(steps.indexOf(newValue) + 1);
                    }}
                    options={steps}
                    renderInput={(params) => (
                      <TextField {...params} label="Change State" />
                    )}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveState}
                    style={{ marginTop: "20px" , width: "100%"}}
                  >
                    Save State
                  </Button>
                </div>
              </div>
            </>
          )
        )}
      </div>
      <BottomHeader />
    </>
  );
}