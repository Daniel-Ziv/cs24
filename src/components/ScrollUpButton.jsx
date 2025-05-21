import React, { useEffect, useState } from "react";

const ScrollUpButton = ({ styles }) => {
  const [scroll, setScroll] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? scrollTop / docHeight : 0;
      setScroll(scrolled);
      setShow(window.scrollY > 200);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Square progress bar dimensions
  const size = 48;
  const borderRadius = 8; // modern look
  const fillHeight = size * scroll;

  return show ? (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-6 mb-4 right-6 z-50 shadow-lg border border-blue-200 transition hover:scale-105 ${styles.bgLight || 'bg-white'}`}
      style={{ width: size, height: size, borderRadius, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px 0 rgba(37,99,235,0.10)' }}
    >
      <div style={{ position: 'relative', width: size, height: size }}>
        {/* Progress fill (bottom to top) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: `${fillHeight}px`,
            background: styles.background ,// Tailwind blue-200
            borderRadius: borderRadius,
            transition: 'height 0.01s linear',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
        {/* Arrow icon */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ position: 'relative', zIndex: 2, display: 'block', margin: 'auto' }}
        >
          <polygon
            points={`${size / 2 - 10},${size / 2 + 6} ${size / 2},${size / 2 - 10} ${size / 2 + 10},${size / 2 + 6}`}
            fill={styles.textColor ? undefined : '#2563eb'}
            className={`${styles.textColor}`}
            style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.08))' }}
          />
        </svg>
      </div>
    </button>
  ) : null;
};

export default ScrollUpButton;