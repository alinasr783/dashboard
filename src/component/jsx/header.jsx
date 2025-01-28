import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.css";
import "../css/header.css";
import { useNavigate } from "react-router-dom";

export default function Header({ title , back}){
  const navigate = useNavigate();

  return(
    <>
      <div className="header">
        <div className="header-content">
          <div className="header-content-back" onClick={()=>navigate(`${back ? back : "/"}`)}>
            <i className="fa fa-arrow-left"></i>
          </div>
          <div className="header-content-title">{title}</div>
        </div>
      </div>
    </>
  )
}