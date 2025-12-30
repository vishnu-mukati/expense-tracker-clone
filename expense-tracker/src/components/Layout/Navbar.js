import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { themeAction } from "../../store/ThemeSlice";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Brightness4, Brightness7, Menu as MenuIcon } from "@mui/icons-material";

const Navbar = () => {
  const [pageTitle, setPageTitle] = useState("Welcome to Expense Tracker!!!");
  const [totalAmount, setTotalAmount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const isPremium = useSelector(state => state.auth.premiumUser);
  const dispatch = useDispatch();
  const isDarkTheme = useSelector(state => state.theme.isDarkTheme);
  const isAuth = useSelector(state => state.auth.isAuthenticated);
  const totalexpense = useSelector(state => state.expense.expensedata);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const totalamount = totalexpense.reduce((totalAmount, expense) => {
    return totalAmount + parseInt(expense.amount);
  }, 0);

  useEffect(() => {
    setTotalAmount(totalamount);
  }, [totalamount]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const activePremiumHandler = () => {
    console.log("Premium Activated!");
    dispatch(themeAction.toggleTheme());
  };


  const buyPremiumHandler = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post("http://localhost:4000/payment/pay", {}, {
        headers: { Authorization: token }
      });
      const paymentSessionId = response.data.paymentSessionId;
      let orderId = response.data.orderId;
      console.log("Payment Session ID:", paymentSessionId);
      if (!paymentSessionId) {
        console.error("Payment session ID not received from backend");
        return;
      }

      const cashfree = await load({
        mode: "sandbox",
      })

      let checkoutOptions = {
        paymentSessionId: paymentSessionId, 
        redirectTarget: "_modal",
      }

      const result = await cashfree.checkout(checkoutOptions);

      if (result.error) {
        console.log("User has closed the popup or there is some payment error, Check for Payment Status");
        console.log(result.error);
      }
      if (result.redirect) {
        console.log("Payment will be redirected");
      }
      console.log("Checkout result:", result);
      try {
        const resp = await axios.get(`http://localhost:4000/payment/payment-status/${orderId}`, {
          headers: token ? { Authorization: token } : {}
        });
        const data = resp.data;
        if (data.status === 'Success') {
          dispatch({ type: 'authentication/setPremium', payload: true });
        } else {
          dispatch({ type: 'authentication/setPremium', payload: false });
        }
        alert("Your payment status is: " + data.status);
      } catch (verifyErr) {
        console.error("Error verifying payment status:", verifyErr);
        alert("Unable to verify payment status right now. Please check later.");
      }
    } catch (err) {
      console.error("Error in Buy Premium:", err);
    }
  };


  return (
    <AppBar
      position="sticky"
      sx={{
        background: isDarkTheme
          ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
          : "linear-gradient(135deg, #38015c 0%, #6d28d9 100%)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0.5rem 0",
          }}
        >
          {/* Logo */}
          <Link to="/welcome" style={{ textDecoration: "none" }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
                background: "linear-gradient(135deg, #fbbf24 0%, #fcd34d 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              Expense Tracker
            </Typography>
          </Link>

          {/* Desktop Menu */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              {isAuth && (
                <>
                  <Link to="/welcome" style={{ textDecoration: "none" }}>
                    <Button color="inherit" sx={{ fontSize: "0.95rem" }}>
                      Welcome
                    </Button>
                  </Link>
                  <Link to="/completeprofile" style={{ textDecoration: "none" }}>
                    <Button
                      color="inherit"
                      sx={{
                        fontSize: "0.95rem",
                        background: "rgba(255, 255, 255, 0.1)",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        "&:hover": {
                          background: "rgba(255, 255, 255, 0.2)",
                        },
                      }}
                    >
                      Complete Profile
                    </Button>
                  </Link>
                </>
              )}

              {/* {totalAmount >= 10000 && (
                <Button
                  variant="contained"
                  sx={{
                    background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                    color: "#000",
                    fontWeight: 600,
                    "&:hover": {
                      background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    },
                  }}
                  onClick={activePremiumHandler}
                >
                  Activate Premium
                </Button>
              )} */}

              {isAuth && !isPremium && (
                <Button
                  variant="contained"
                  sx={{
                    background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #db2777 0%, #be185d 100%)",
                    },
                  }}
                  onClick={buyPremiumHandler}
                >
                  Buy Premium
                </Button>
              )}

              {isAuth && isPremium && (
                <Box
                  sx={{
                    background: "rgba(236, 72, 153, 0.2)",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    color: "#ec4899",
                    fontWeight: 600,
                  }}
                >
                  ⭐ Premium User
                </Box>
              )}

              {/* Theme Toggle */}
              <IconButton
                onClick={activePremiumHandler}
                sx={{
                  color: "inherit",
                  background: "rgba(255, 255, 255, 0.1)",
                  marginLeft: "1rem",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                {isDarkTheme ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Box>
          )}

          {/* Mobile Menu */}
          {isMobile && (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <IconButton
                onClick={activePremiumHandler}
                sx={{ color: "inherit" }}
              >
                {isDarkTheme ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{
                  "& .MuiPaper-root": {
                    background: isDarkTheme
                      ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
                      : "linear-gradient(135deg, #38015c 0%, #6d28d9 100%)",
                  },
                }}
              >
                {isAuth && (
                  <>
                    <MenuItem
                      component={Link}
                      to="/welcome"
                      onClick={handleMenuClose}
                      sx={{ color: "#fff" }}
                    >
                      Welcome
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/completeprofile"
                      onClick={handleMenuClose}
                      sx={{ color: "#fff" }}
                    >
                      Complete Profile
                    </MenuItem>
                  </>
                )}
                {/* {totalAmount >= 10000 && (
                  <MenuItem
                    onClick={() => {
                      activePremiumHandler();
                      handleMenuClose();
                    }}
                    sx={{ color: "#fbbf24" }}
                  >
                    Activate Premium
                  </MenuItem>
                )} */}
                {isAuth && !isPremium && (
                  <MenuItem
                    onClick={() => {
                      buyPremiumHandler();
                      handleMenuClose();
                    }}
                    sx={{ color: "#ec4899" }}
                  >
                    Buy Premium
                  </MenuItem>
                )}
                {isAuth && isPremium && (
                  <MenuItem sx={{ color: "#ec4899" }}>
                    ⭐ Premium User
                  </MenuItem>
                )}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;