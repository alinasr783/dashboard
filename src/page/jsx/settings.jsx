import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import Header from "../../component/jsx/header.jsx";
import { supabase } from "../../lib/supabase.js";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import "../css/settings.css";

export default function Settings() {
  const navigate = useNavigate();
  const [openGreetings, setOpenGreetings] = useState(false);
  const [openAuth, setOpenAuth] = useState(false);

  const [greetings, setGreetings] = useState({
    morning: [],
    afternoon: [],
    evening: [],
    night: [],
  });

  const [authSettings, setAuthSettings] = useState({
    signup_img: "",
    login_img: "",
  });

  const [settingId, setSettingId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSettings();
  }, []);

  // **جلب البيانات من Supabase**
  const fetchSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("setting").select("*").single();
      if (error) throw error;
      if (data) {
        setGreetings(data.greeting);
        setAuthSettings({
          signup_img: data.signup_img || "",
          login_img: data.login_img || "",
        });
        setSettingId(data.id);
      }
    } catch (error) {
      console.error("Error fetching settings:", error.message);
    }
  }, []);

  // **تحديث التحيات عند تعديل القيم**
  const handleGreetingChange = (period, index, value) => {
    setGreetings((prev) => {
      const updatedGreetings = { ...prev };
      updatedGreetings[period][index] = value;
      return updatedGreetings;
    });
  };

  // **تحديث إعدادات الـ Auth عند تعديل القيم**
  const handleAuthChange = (field, value) => {
    setAuthSettings((prev) => ({ ...prev, [field]: value }));
  };

  // **حفظ التحيات في Supabase**
  const saveGreetings = async () => {
    if (!settingId) return;

    try {
      const { error } = await supabase
        .from("setting")
        .update({ greeting: greetings })
        .eq("id", settingId)
        .single();

      if (error) throw error;
      setOpenGreetings(false);
    } catch (error) {
      console.error("Error updating greetings:", error.message);
    }
  };

  // **حفظ إعدادات الـ Auth في Supabase**
  const saveAuthSettings = async () => {
    if (!settingId) return;

    try {
      const { error } = await supabase
        .from("setting")
        .update(authSettings)
        .eq("id", settingId)
        .single();

      if (error) throw error;
      setOpenAuth(false);
    } catch (error) {
      console.error("Error updating auth settings:", error.message);
    }
  };

  return (
    <>
      <Header title="Settings" back="/profile" />
      <div className="settings-content">
        <ul className="menu">
          <li className="menu-item" onClick={() => setOpenGreetings(true)}>
            <div>
              <i className="fas fa-user"></i> Greetings Setting
            </div>
            <i className="fas fa-chevron-right"></i>
          </li>
          <li className="menu-item" onClick={() => setOpenAuth(true)}>
            <div>
              <i className="fas fa-credit-card"></i> Auth Setting
            </div>
            <i className="fas fa-chevron-right"></i>
          </li>
          <li className="menu-item">
            <div>
              <i className="fas fa-box"></i> Delete Account
            </div>
            <i className="fas fa-chevron-right"></i>
          </li>
        </ul>
      </div>
      <BottomHeader />

      {/* نافذة تعديل التحيات */}
      <Dialog open={openGreetings} onClose={() => setOpenGreetings(false)}>
        <DialogTitle>Update Greetings</DialogTitle>
        <DialogContent>
          {["morning", "afternoon", "evening", "night"].map((period) => (
            <div key={period} className="greeting-section">
              <h4>{period.charAt(0).toUpperCase() + period.slice(1)}</h4>

              {greetings[period]?.map((greet, index) => (
                <TextField
                  key={index}
                  fullWidth
                  variant="outlined"
                  value={greet}
                  onChange={(e) => handleGreetingChange(period, index, e.target.value)}
                  style={{ marginBottom: "10px" }}
                />
              ))}
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenGreetings(false)}>Cancel</Button>
          <Button onClick={saveGreetings} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* نافذة إعدادات Auth */}
      <Dialog open={openAuth} onClose={() => setOpenAuth(false)}>
        <DialogTitle>Update Auth Settings</DialogTitle>
        <DialogContent>
          
          <TextField
            fullWidth
            label="Signup Image URL"
            variant="outlined"
            value={authSettings.signup_img}
            onChange={(e) => handleAuthChange("signup_img", e.target.value)}
            style={{ marginBottom: "10px" , marginTop:"10px"}}
          />
          <TextField
            fullWidth
            label="Login Image URL"
            variant="outlined"
            value={authSettings.login_img}
            onChange={(e) => handleAuthChange("login_img", e.target.value)}
            style={{ marginBottom: "10px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAuth(false)}>Cancel</Button>
          <Button onClick={saveAuthSettings} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}