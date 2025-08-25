import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Navbar, Offcanvas, Nav, Button } from "react-bootstrap";
import { fetchUser, logout } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchPortfolios } from "../redux/slices/portfolioSlice";

export default function DashBoardLayout() {
  const [showSidebar, setShowSidebar] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const userid = user?._id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navItems = [
    { path: "/dashboard", icon: "📊", label: "Dashboard" },
    { path: "/portfolios", icon: "📁", label: "Portfolio" },
  ];

  useEffect(() => {
    dispatch(fetchUser());
    if (userid) {
      dispatch(fetchPortfolios(userid));
    }
  }, [dispatch, userid]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="d-flex vh-100 overflow-hidden bg-light">
      {/* Mobile Navbar */}
      <Navbar
        expand={false}
        bg="white"
        className="d-md-none border-bottom shadow-sm position-fixed w-100 z-3"
      >
        <div className="d-flex justify-content-between align-items-center w-100 px-3">
          <span className="fw-bold text-primary">💹 Investment Tracker</span>
          <Button
            variant="outline-primary"
            className="rounded-circle"
            onClick={() => setShowSidebar(true)}
          >
            ☰
          </Button>
        </div>
      </Navbar>

      {/* Sidebar */}
      <Offcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        responsive="md"
        className="bg-white shadow vh-100 border-end"
        style={{ minWidth: 260, maxWidth: 280 }}
      >
        <Offcanvas.Header closeButton className="border-bottom d-md-none">
          <Offcanvas.Title className="fw-bold text-primary">
            💹 Investment Tracker
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column justify-content-between p-0">
          {/* Sidebar Header */}
          <div className="d-none d-md-flex flex-column align-items-center py-4 border-bottom">
            <div className="bg-primary bg-gradient rounded-circle mb-2" style={{ width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: "#fff" }}>
              💹
            </div>
            <div className="fw-bold text-primary mb-1">Investment Tracker</div>
            {user && (
              <div className="text-muted small">{user.email}</div>
            )}
          </div>
          {/* Navigation */}
          <Nav className="flex-column mt-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center px-4 py-3 my-1 rounded-3 transition ${
                    isActive
                      ? "bg-primary text-white fw-semibold shadow-sm"
                      : "text-dark fw-semibold sidebar-link"
                  }`
                }
                style={{ fontSize: 17 }}
                onClick={() => setShowSidebar(false)}
              >
                <span className="me-3 fs-4">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </Nav>
          {/* Sidebar Footer */}
          <div className="border-top mt-3 p-4">
            <Button
              variant="outline-danger"
              className="w-100 fw-semibold d-flex align-items-center justify-content-center"
              onClick={handleLogout}
            >
              🚪 Logout
            </Button>
            <p className="text-center text-muted small mt-3 mb-0">
              &copy; {new Date().getFullYear()} Investment Tracker
            </p>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content */}
      <main className="flex-grow-1 h-100 overflow-auto d-flex flex-column align-items-center justify-content-start pt-5 pt-md-0">
        <div className="container-fluid py-4 px-2 px-md-4" style={{ maxWidth: 1200, width: "100%" }}>
          <div className="bg-white rounded-4 shadow-sm p-4 h-100">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Custom styles for sidebar link hover */}
      <style>{`
        .sidebar-link:hover {
          background: #f1f3f9;
          color: #0d6efd;
          text-decoration: none;
        }
        .transition {
          transition: background 0.2s, color 0.2s;
        }
      `}</style>
    </div>
  );
}
