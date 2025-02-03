import React,{useState,useEffect} from "react";
import { WishlistActive , OrdersActive , CartActive, Money , UsersIcon} from "../../component/jsx/icons.jsx";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import { supabase } from "../../lib/supabase.js";
import "@fortawesome/fontawesome-free/css/all.css";
import "../css/home.css";

export default function Home() {
  const [points, setPoints] = useState(0);
  const [ordersNum, setOrdersNum] = useState(0);
  const [cartsNum, setCartsNum] = useState(0);
  const [wishlistNum, setWishlistNum] = useState(0);
  const [moneyNum, setMoneyNum] = useState(0);
  const [usersNum, setUsersNum] = useState(0);

  const [top_sales, setTop_sales] = useState([]);
  const [addedCart, setAddedCart] = useState([]);
  const [addedWishlist, setAddedWishlist] = useState([]);
  const [viewers, setViewers] = useState([]);

  const getPoints = async () =>{
    const { data, error } = await supabase.from('setting').select('*')
    setPoints(data[0].points)
  }
  const getOrdersNum = async () => {
    const { data, error } = await supabase.from("order").select("*");
    setOrdersNum(data.length);
  }
  const getCartsNum = async () => {
    const { data, error } = await supabase.from("cart").select("*");
    for(let i = 0; i < data.length; i++){
      if(data[i].products.length > 0){
        setCartsNum(cartsNum + data[i].products.length);
      }
    }
  }
  const getWishlistNum = async () => {
    const { data, error } = await supabase.from("wishlist").select("*");
    for(let i = 0; i < data.length; i++){
      if(data[i].products.length > 0){
        setWishlistNum(wishlistNum + data[i].products.length);
      }
    }
  }
  const getMoneyNum = async () => {
    const { data, error } = await supabase.from("order").select("*");
    for(let i = 0; i < data.length; i++){
      setMoneyNum(moneyNum + data[i].total_price)
    }
  }
  const getUsersNum = async () => {
    const { data, error } = await supabase.from("user").select("*");
    setUsersNum(data.length);
  }

  const getTopSales = async () => {
    const { data, error } = await supabase.from("product").select("title, images, orders, price");

    if (error) {
      console.error("Error fetching data:", error);
      return;
    }

    // ترتيب المنتجات حسب عدد الـ orders بشكل تنازلي
    const topSales = data
      .sort((a, b) => b.orders - a.orders)  // ترتيب المنتجات حسب الـ orders
      .slice(0, 3)  // أخذ أول 3 منتجات

    // تحديث الـ state بالقيم المطلوبة
    setTop_sales(topSales.map(product => ({
      title: product.title,
      image: product.images[0],
      orders: product.orders,
      price: product.price
    })));
  };
  const getAddedCart = async () => {
    const { data, error } = await supabase.from("product").select("title, images, added_cart, price");

    if (error) {
      console.error("Error fetching data:", error);
      return;
    }

    // ترتيب المنتجات حسب عدد الـ orders بشكل تنازلي
    const topAdded_cart = data
      .sort((a, b) => b.added_cart - a.added_cart)  // ترتيب المنتجات حسب الـ orders
      .slice(0, 3)  // أخذ أول 3 منتجات

    setAddedCart(topAdded_cart.map(product => ({
      title: product.title,
      image: product.images[0],
      times: product.added_cart,
      price: product.price
    })));
  }
  const getAddedwishlist = async () => {
    const { data, error } = await supabase.from("product").select("title, images, added_wishlist, price");

    if (error) {
      console.error("Error fetching data:", error);
      return;
    }

    // ترتيب المنتجات حسب عدد الـ orders بشكل تنازلي
    const topAdded_wishlist = data
      .sort((a, b) => b.added_wishlist - a.added_wishlist)  // ترتيب المنتجات حسب الـ orders
      .slice(0, 3)  // أخذ أول 3 منتجات

    setAddedWishlist(topAdded_wishlist.map(product => ({
      title: product.title,
      image: product.images[0],
      times: product.added_wishlist,
      price: product.price
    })));
  }
  const getViewers = async () => {
    const { data, error } = await supabase.from("product").select("title, images, viewer, price");

    if (error) {
      console.error("Error fetching data:", error);
      return;
    }

    const topViewer = data
      .sort((a, b) => b.viewer - a.viewer)  // ترتيب المنتجات حسب الـ orders
      .slice(0, 3)  // أخذ أول 3 منتجات

    setViewers(topViewer.map(product => ({
      title: product.title,
      image: product.images[0],
      times: product.viewer,
      price: product.price
    })));
  }
  
  useEffect(()=>{
    getOrdersNum();
    getCartsNum();
    getWishlistNum();
    getMoneyNum();
    getUsersNum();

    getTopSales();
    getAddedCart();
    getAddedwishlist();
    getViewers();
  },[])
  
  return (
    <>
      <div className="home">
      <div className="overwrite">
        <div className="overwrite-content">
          <div className="overwrite-content-cards">
            {/* Existing Cards */}
            <div className="overwrite-content-cards-card points">
              <div className="overwrite-content-cards-card-icon">
                <div
                  className={`heart-icon`}
                  dangerouslySetInnerHTML={{
                    __html: OrdersActive,
                  }}
                />
              </div>
              <div className="overwrite-content-cards-card-content">
                <div className="overwrite-content-cards-card-content-value-p">
                  <i className="fa fa-plus"></i>
                  {points}
                </div>
                <div className="overwrite-content-cards-card-content-title-p">
                  Points
                </div>
              </div>
            </div>
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
                  {ordersNum}
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
                  {cartsNum}
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
                  {wishlistNum}
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
                  {moneyNum} EGP
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
                  {usersNum}
                </div>
                <div className="overwrite-content-cards-card-content-title">
                  Users
                </div>
              </div>
            </div>
          </div>

          {/* Top Sales Section */}

          <div className="top-sales">
            <h2 className="top-sales-title">Top Sales</h2>
            {top_sales.map((el)=>(
              <div className="top-sales-card">
                <img
                  src={el.image}
                  alt={el.title}
                  className="top-sales-image"
                />
                <div className="top-sales-info">
                  <h3>{el.title}</h3>
                  <p>Sales : {el.orders} times</p>
                  <span>Price : {el.price} EGP</span>
                </div>
              </div>
            ))}
          </div>
          <div className="top-sales">
            <h2 className="top-sales-title">Added Card</h2>
            {addedCart.map((el)=>(
              <div className="top-sales-card">
                <img
                  src={el.image}
                  alt={el.title}
                  className="top-sales-image"
                />
                <div className="top-sales-info">
                  <h3>{el.title}</h3>
                  <p>Time : {el.times} times</p>
                  <span>Price : {el.price} EGP</span>
                </div>
              </div>
            ))}
          </div>
          <div className="top-sales">
            <h2 className="top-sales-title">Added Wishlist</h2>
            {addedWishlist.map((el)=>(
              <div className="top-sales-card">
                <img
                  src={el.image}
                  alt={el.title}
                  className="top-sales-image"
                />
                <div className="top-sales-info">
                  <h3>{el.title}</h3>
                  <p>Time : {el.times} times</p>
                  <span>Price : {el.price} EGP</span>
                </div>
              </div>
            ))}
          </div>
          <div className="top-sales">
            <h2 className="top-sales-title">Top Viewer</h2>
            {addedWishlist.map((el)=>(
              <div className="top-sales-card">
                <img
                  src={el.image}
                  alt={el.title}
                  className="top-sales-image"
                />
                <div className="top-sales-info">
                  <h3>{el.title}</h3>
                  <p>Viewer : {el.times} times</p>
                  <span>Price : {el.price} EGP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomHeader />
      </div>
    </>
  );
}