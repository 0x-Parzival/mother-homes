import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThreeDCarousel from "../../components/ThreeDCarousel";
import PropertiesSection from "../../components/PropertiesSection";
import Feature from "../../components/Feature";

import CustomerReview from "../../components/CustomerReview";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

const HomePage: React.FC = () => {

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userName = localStorage.getItem("userName");
      toast.info(`Welcome back${userName ? `, ${userName}` : ""}!`);
    }
  }, []);

  return (
    <>
      <ToastContainer position="top-right" />
      <Navbar />
      <ThreeDCarousel />
      <PropertiesSection />
      <Feature />

      <CustomerReview />
      <Footer />
    </>
  );
};

export default HomePage;
