"use client";

import { useState } from "react";
import HoverImageLink from "./hoverImageLink";
import Link from "next/link";
import { IconHome } from "@/app/components/svgIcons";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const Navigation = ({ data }) => {
  const [hoveredMenu, setHoveredMenu] = useState(null);
  
  const handleMenuHover = (menuName) => {
    setHoveredMenu(menuName);
  };
  
  const handleMenuLeave = () => {
    setHoveredMenu(null);
  };
  
  const dropdownVariants = {
    hidden: { 
      opacity: 0,
      y: -10,
      height: 0,
      transition: { duration: 0.2, ease: "easeInOut" }
    },
    visible: { 
      opacity: 1,
      y: 0,
      height: "auto",
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      y: -10,
      height: 0,
      transition: { duration: 0.2, ease: "easeInOut" }
    }
  };

  // Render a menu item based on its type (simple or nested)
  const renderMenuItem = (item) => {
    // For the Home menu item with IconHome
    if (item.label === "Home") {
      return (
        <Link href={item.url} className='p-2' key={item.id}>
          <IconHome
            fill="#fff"
            style={{
              width: 13,
              height: 13
            }}
          />
        </Link>
      );
    }
    
    // For simple menu items (no dropdown)
    if (item.type === "simple") {
      return (
        <div key={item.id}>
          <Link href={item.url} className='flex items-center gap-1'>
            {item.label}
          </Link>
        </div>
      );
    }
    
    // For nested menu items (with dropdown)
    if (item.type === "nested") {
      return (
        <div 
          key={item.id}
          className='relative'
          onMouseEnter={() => handleMenuHover(item.label.toLowerCase())}
          onMouseLeave={handleMenuLeave}
        >
          <Link href={item.url} className='flex items-center gap-1 py-[20px]'>
            {item.label}<ChevronDown className="w-4 h-4" />
          </Link>
          
          <AnimatePresence>
            {hoveredMenu === item.label.toLowerCase() && (
              <motion.div 
                className='absolute top-[100%] w-max -left-8 max-h-[calc(100vh-100px)] p-8 pt-0 z-40 text-white text uppercase tracking-widest bg-black rounded-bl-[40px] rounded-br-[40px]'
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="absolute -left-[41px] -top-[1px] w-[42px] h-[42px] overflow-hidden ">
                  <div className="absolute w-[200%] h-[200%] top-0 right-0 rounded-full" style={{
                    boxShadow: '50px -50px 0 0 #000'
                  }}></div>
                </div>

                <div className="absolute -right-[41px] -top-[1px] w-[42px] h-[42px] overflow-hidden">
                  <div className="absolute w-[200%] h-[200%] top-0 left-0 rounded-full" style={{
                    boxShadow: '-50px -50px 0 0 #000'
                  }}></div>
                </div>

                <motion.div 
                  className='flex gap-5 pt-6'
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  {item.imageUrl && (
                    <div className='flex gap-5'>
                      <div className='overflow-hidden rounded-3xl relative'>
                        <motion.div
                          initial={{ scale: 1.1 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.8 }}
                        >
                          <Image 
                            unoptimized={true} 
                            src={item.imageUrl} 
                            alt={`${item.label} dropdown`} 
                            width={300} 
                            height={600} 
                            className='object-cover' 
                          />
                        </motion.div>
                      </div>
                    </div>
                  )}
                  <div className='min-w-[200px]'>
                    <h3 className='text-lg mb-1'>{item.bigTitle || item.label}</h3>
                    <ul className="grid grid-cols-2 gap-x-5">
                      {item.subMenus && item.subMenus.map((subMenu, index) => (
                        <motion.li
                          key={`${item.id}-submenu-${index}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + (index * 0.1), duration: 0.3 }}
                        >
                          {subMenu.imageUrl ? (
                            <HoverImageLink url={subMenu.url} title={subMenu.label} image={subMenu.imageUrl} />
                          ) : (
                            <Link href={subMenu.url} className="block py-2 hover:text-gray-300 transition-colors">
                              {subMenu.label}
                            </Link>
                          )}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className='flex items-center gap-3'>
      {/* Filter out Home to render it separately */}
      {data?.filter(item => item.label === "Home").map(renderMenuItem)}

      <div className='text-white text-[11px] uppercase flex items-center gap-4 tracking-[1.5px]'>
        {/* Render all items except Home */}
        {data?.filter(item => item.label !== "Home").map(renderMenuItem)}
      </div>
    </div>
  );
};

export default Navigation;