import React,{useEffect} from "react";
import { useNavigate } from "react-router-dom";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import Header from "../../component/jsx/header.jsx";
import "../css/settings.css";

export default function Settings(){
  useEffect(() => {
    window.scrollTo(0, 0); // التمرير إلى أعلى نقطة في الصفحة
  }, []); // [] لضمان تنفيذها مرة واحدة فقط عند التحميل
  return(
    <>
      <Header title={"Settings"} back={"/profile"}/>
      <div className="settings-content">
        <ul className="menu">
          <li className="menu-item">
            <div>
              <i className="fas fa-user"></i>
              greetings setting
            </div>
            <i className="fas fa-chevron-right"></i>
          </li>
          <li className="menu-item">
            <div>
              <i className="fas fa-credit-card"></i>
              Auth setting
            </div>
            <i className="fas fa-chevron-right"></i>
          </li>
          <li className="menu-item">
            <div>
              <i className="fas fa-box"></i>
              Delete Account
            </div>
            <i className="fas fa-chevron-right"></i>
          </li>
        </ul>
      </div>
      <BottomHeader />
    </>
  )
}