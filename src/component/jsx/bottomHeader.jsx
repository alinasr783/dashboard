import React,{useState,useEffect} from "react";
import { useNavigate , useLocation} from "react-router-dom";
import { HomeIcon, HomeActive, CartIcon, CartActive, WishlistIcon, WishlistActive, OrdersActive, OrdersIcon, ProfileIcon, ProfileActive } from './icons';
import "../css/bottomHeader.css";
import { fabClasses } from "@mui/material";

export default function BottomHeader({vertical}) {
  const [isVertical, setIsVertical] = useState(vertical);
  const navigate = useNavigate();
  const location = useLocation();
  const [isHome, setIsHome] = useState(false);
  const [isCart, setIsCart] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);
  const [isOrders, setIsOrders] = useState(false);
  const [isProfile, setIsProfile] = useState(false);
  const [isSmall, setIsSmall] = useState(false);


  useEffect(() => {
    // تحديث الحالة بناءً على المسار الحالي
    if (location.pathname === "/" || location.pathname === "/home") {
      setIsHome(true);
      setIsCart(false);
      setIsWishlist(false);
      setIsOrders(false)
      setIsProfile(false)
    } else if (location.pathname === "/products") {
      setIsHome(false);
      setIsCart(true);
      setIsWishlist(false);
      setIsOrders(false)
      setIsProfile(false)
    } else if (location.pathname === "/users") {
      setIsHome(false);
      setIsCart(false);
      setIsWishlist(true);
      setIsOrders(false)
      setIsProfile(false)
    }else if(location.pathname === "/orders"){
      setIsHome(false);
      setIsCart(false);
      setIsWishlist(false);
      setIsOrders(true);
      setIsProfile(false)
    }else if(location.pathname === "/profile"){
      setIsHome(false);
      setIsCart(false);
      setIsWishlist(false);
      setIsOrders(false);
      setIsProfile(true);
    }
  }, [location]);
  useEffect(()=>{
    if(!isSmall && vertical){
      const timer = setTimeout(() => {
        setIsSmall(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  },[isSmall])
  const handleClick = () =>{
    if(vertical&&isSmall){
      setIsSmall(false);
    }
  }  

  const handleHomeClicked = () => {
    setIsHome(true);
    navigate("/");
  }
  const handleCartClicked = () => {
    setIsCart(true);
    navigate("/products");
  }
  const handleWishlistClicked = () => {
    setIsWishlist(true);
    navigate("/users");
  }
  const handleOrdersClicked = () => {
    setIsWishlist(true);
    navigate("/orders");
  }
  const handleProfileClicked = () => {
    setIsProfile(true);
    navigate("/profile");
  }

  return (
    <div className={`bottom-header ${vertical && !isSmall ? "vertical" : "horizontal"} ${vertical && isSmall  ? "small" : vertical && !isSmall ? "big" : ""}`} onClick={()=>handleClick()}>
      <div className={`bottom-header-content ${vertical && !isSmall ? "vertical" : "horizontal"} ${vertical && isSmall  ? "small" : vertical && !isSmall ? "big" : ""}`}>
        <div className={`bottom-header-content-home ${isHome ? "active" : ""} ${vertical ? "vertical" : ""} ${isSmall ? "hide" : ""}`} onClick={handleHomeClicked}>
          <div className="home-icon" dangerouslySetInnerHTML={{ __html: isHome ? HomeActive : HomeIcon }} />
        </div>
        <div className={`bottom-header-content-cart ${isCart ? "active" : ""} ${isSmall ? "hide" : ""}`} onClick={handleCartClicked}>
          <div className="cart-icon" dangerouslySetInnerHTML={{ __html: isCart ? CartActive : CartIcon }} />
        </div>
        <div className={`bottom-header-content-wishlist ${isWishlist ? "active" : ""} ${isSmall ? "hide" : ""}`} onClick={handleWishlistClicked}>
          <div className="wishlist-icon" dangerouslySetInnerHTML={{ __html: isWishlist ? WishlistActive : WishlistIcon }} />
        </div>
        <div className={`bottom-header-content-orders ${isOrders ? "active" : ""} ${isSmall ? "hide" : ""}`} onClick={handleOrdersClicked} >
          <div className="orders-icon" dangerouslySetInnerHTML={{ __html: isOrders ? OrdersActive : OrdersIcon }} />
        </div>
        <div className={`bottom-header-content-profile ${isProfile ? "active" : ""} ${isSmall ? "hide" : ""}`} onClick={handleProfileClicked}>
          <div className="profile-icon" dangerouslySetInnerHTML={{ __html: isProfile ? ProfileActive : ProfileIcon}}/>
        </div>
      </div>
    </div>
  );
}