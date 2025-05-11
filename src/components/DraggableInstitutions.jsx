import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const DraggableInstitutions = () => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Check on initial load
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // Calculate the width for mobile view to show 2.5 institutions
  const calculateMobileWidth = () => {
    if (!isMobile || !scrollRef.current) return {};
    
    // Get container width
    const containerWidth = scrollRef.current.clientWidth;
    // Calculate institution width (40% of container width)
    // This will show 2.5 institutions (2 full + half of the 3rd)
    const institutionWidth = Math.floor(containerWidth * 0.4);
    
    return { width: `${institutionWidth}px` };
  };

  const handleMouseDown = (e) => {
    if (isMobile) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    if (isMobile) return;
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (isMobile || !isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e) => {
    if (isMobile) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (isMobile || !isDragging) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const institutions = [
    {name: 'HIT', desc: 'מכון טכנולוגי חולון', comingSoon: false},
    {name: 'TAU', desc: 'אוניברסיטת תל אביב', comingSoon: true},
    {name: 'HUJI', desc: 'האוניברסיטה העברית', comingSoon: true},
    {name: 'BGU', desc: 'אוניברסיטת בן גוריון', comingSoon: true},
    {name: 'Technion', desc: 'הטכניון', comingSoon: true},
    {name: 'Afeka', desc: 'מכללת אפקה', comingSoon: true},
    {name: 'SCE', desc: 'מכללת SCE', comingSoon: true},
    {name: 'Ariel', desc: 'אוניברסיטת אריאל', comingSoon: true},
    {name: 'Bar-Ilan', desc: 'אוניברסיטת בר-אילן', comingSoon: true},
    {name: 'Haifa', desc: 'אוניברסיטת חיפה', comingSoon: true},
    {name: 'Shenkar', desc: 'שנקר', comingSoon: true},
    {name: 'Ruppin', desc: 'מרכז רופין', comingSoon: true},
    {name: 'MTA', desc: 'המכללה האקדמית תל אביב-יפו', comingSoon: true},
    {name: 'Sapir', desc: 'מכללת ספיר', comingSoon: true},
    {name: 'Kinneret', desc: 'מכללת כנרת', comingSoon: true},
    {name: 'JCT', desc: 'מכון לב', comingSoon: true},
    {name: 'Hadassah', desc: 'מכללת הדסה', comingSoon: true},
    {name: 'Azrieli', desc: 'מכללת עזריאלי', comingSoon: true},
    {name: 'ORT', desc: 'מכללת אורט', comingSoon: true},
    {name: 'Achva', desc: 'מכללת אחווה', comingSoon: true},
  ];

  return (
    <div 
      ref={scrollRef}
      className={`flex overflow-x-auto pb-2 ${isMobile ? '' : 'cursor-grab active:cursor-grabbing'} scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent`} 
      style={{ scrollbarWidth: 'thin' }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleMouseUp}
      onTouchMove={handleTouchMove}
    >
      <div className="flex gap-4 pr-3 pl-3">
        {institutions.map((institute, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + (index * 0.03), duration: 0.2 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`flex-shrink-0 flex flex-col items-center bg-white rounded-lg shadow-sm border border-blue-50 hover:shadow-md hover:border-blue-200 transition-all duration-300 ${isMobile ? 'p-6' : 'p-3 w-24'} relative`}
            style={isMobile ? calculateMobileWidth() : {}}
          >
            <div className={`text-gray-800 font-bold mb-1 ${isMobile ? 'text-lg' : ''}`}>{institute.name}</div>
            <div className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-xs'} text-center`}>{institute.desc}</div>
            {institute.comingSoon && (
              <div className="absolute -bottom-1 right-0 bg-red-200/80 text-[8px] text-black font-bold py-0.5 px-1.5 rounded-full shadow-sm">
                בקרוב...
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DraggableInstitutions;
