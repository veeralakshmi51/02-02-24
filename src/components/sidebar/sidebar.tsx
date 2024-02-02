import React, { useEffect, useState } from "react";
import {
  FaBars,
  FaSpellCheck,
  FaBuilding,
  FaHospitalUser,
  FaUserFriends,
  FaBroadcastTower,
  FaReceipt,
  FaBed,
  FaUserCog,
} from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import "./sidebar.css";
import Header from "../header";
import { useSelector } from "react-redux";
interface SidebarProps {
  children: any;
}

const ResizeHandler = ({ setIsOpen }: { setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth > 1068);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return null;
};

const Sidebar = (props: SidebarProps) => {
    const { userType, organization} = useSelector((state: any) => state.Login);
    const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  
    const { children } = props;
    const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
    const location = useLocation();

    const isLoginPage = location.pathname === '/login';
    const isSecretKeyPage = location.pathname === '/secret-key';
    const isForgotPage = location.pathname === '/forgot-password';
    const showSideBar = !isLoginPage && !isSecretKeyPage && !isForgotPage;
  
    if (!showSideBar) {
      return null;
    }
  
    const toggle = () => setIsOpen(!isOpen);
  
    const menuItem = [
      {
        path: "/organization-details",
        name: "Master Organization",
        icon: <FaBuilding />,
        show: userType === "Super Admin",
      },
      {
        path: "/q15-staff-configuration",
        name: "Q15 Staff Configuration",
        icon: <FaSpellCheck />,
        show: userType === "Admin",
      },
      {
        path: `/organization-update/${organization}`,
        name: "Organization Details",
        icon: <FaBuilding />,
        show: userType === "System Admin",
      },
      {
        path: "/staff-table",
        name: "Staff Creation",
        icon: <FaHospitalUser />,
        show: userType === "System Admin",
      },      
      {
        path: "/beacon-table",
        name: "Beacon Devices",
        icon: <FaBroadcastTower />,
        show: userType === "System Admin",
      },
      {
        name: "Management",
        icon: <FaUserCog />,
        show: userType === "Admin",
        submenu: [
          {
            path: "/patient-table",
            name: "Patient Creation",
            icon: <FaUserFriends />,
            show: userType === "Admin",
          },
          {
            path: "/bed-table",
            name: "Bed Assign",
            icon: <FaBed />,
            show: userType === "Admin",
          }
        ],
      },
      {
        path: "/q15-report",
        name: "Q15 Report",
        icon: <FaReceipt />,
        show: userType === "Admin",
      },
    ];
    

 
    const handleSubMenuClick = (index: number) => {
      setActiveSubmenu((prevActiveSubmenu) => {
        return prevActiveSubmenu === index || !menuItem[index].submenu ? null : index;
      });
    };
    
  return (
    <>
    {showSideBar && (
    <div className="container1">
      <div style={{ width: isOpen ? "300px" : "50px" }} className="sidebar">
        <div className="top_section">
          <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">
            M H C
          </h1>
          <div style={{ marginLeft: isOpen ? "50px" : "0px"}} className="bars">
            <FaBars onClick={toggle} style={{cursor:'pointer'}}/>
          </div>
        </div>
        {menuItem.map((item, index) =>
  item.show ? (
    <React.Fragment key={index}>
      {item.submenu ? (
        <div
          onClick={() => handleSubMenuClick(index)}
          className="link"
        >
          <div className="icon">{item.icon}</div>
          <div
            style={{ display: isOpen ? "block" : "none" }}
            className="link_text"
          >
            {item.name}
          </div>
        </div>
      ) : (
        <NavLink to={item.path} key={index}  className="link">
          <div className="icon">{item.icon}</div>
          <div
            style={{ display: isOpen ? "block" : "none" }}
            className="link_text"
          >
            {item.name}
          </div>
        </NavLink>
      )}
      {
        activeSubmenu === index &&
        item.submenu &&
        item.submenu.length > 0 && (
          <div className="submenu">
            {item.submenu.map((subItem, subIndex) => (
              <NavLink style={{height: isOpen? "" : "3em"}}
                to={subItem.path}
                key={subIndex}
                className="link"
              >
                <div className="icon" style={{ marginLeft: isOpen ? "15%":"-37%",display:isOpen ?"":'flex' }}>
                  <span style={{position:'relative',top:'-8px'}}>{isOpen? "" : "→"}</span>{subItem.icon}
                </div>
                <div className="link_text">{subItem.name}</div>
              </NavLink>
            ))}
          </div>
        )}
    </React.Fragment>
  ) : null
)}

      </div>
      <div
        className="w-100"
        style={{
          marginLeft: isOpen ? "300px" : "50px",
          marginTop: 0,
          overflowY: "auto",
        }}
      >
        <Header />
        {children}
      </div>
    </div>
    )}
    <ResizeHandler setIsOpen={setIsOpen} />
    </>
  );
};

export default Sidebar;