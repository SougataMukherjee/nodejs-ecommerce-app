import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import PageTransition from "../components/PageTransition";
import Chatbot from "../components/Chatbot";

function MainLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen" style={{ background: '#0d0d1a', color: '#fff' }}>
      <Navbar />
      <PageTransition key={location.pathname}>
        <motion.main
          className="container mx-auto p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Outlet />
        </motion.main>
      </PageTransition>
      <Chatbot />
    </div>
  );
}

export default MainLayout;