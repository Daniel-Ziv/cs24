import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from './ui/card';
import { courseStyles } from '../config/courseStyles';
import { csHelpfulLinks, eeHelpfulLinks } from '../config/courseMappings'; // Import your helpful links

// Add useWindowSize hook
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
      });
    }
    
    window.addEventListener("resize", handleResize);
    handleResize(); // Call initially
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

const HelpfulLinksSection = ({ courseType }) => {
  const { width } = useWindowSize();
  const [isOpen, setIsOpen] = useState(width >= 1024);

  // Update isOpen when screen size changes
  useEffect(() => {
    setIsOpen(width >= 1024);
  }, [width]);


  const linkmaps = {
    cs: csHelpfulLinks,
    ee: eeHelpfulLinks
  };
  const helpfulLinks = linkmaps[courseType] || csHelpfulLinks;
  // Define styles based on course type
  const styles = courseStyles[courseType] || courseStyles.cs;

  return (
    <Card className={`mb-2.5 bg-white border ${styles.cardBorder}`}>
      <div className={`${styles.subjectBg} ${width < 1024 ? 'p-6 pt-7' : 'p-9 pt-10'}`}>
        <button 
          onClick={() => width < 1024 && setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between gap-2  ${width < 1024 ? 'cursor-pointer' : ''}`}
        >
          <div className="flex items-center gap-2">
            <LinkIcon className={`h-6 w-6 ${styles.iconColor}`} />
            <h2 className={`text-2xl font-semibold ${styles.textColor}`}>
              קישורים שיכולים לעזור
            </h2>
          </div>
          {/* Only show toggle icon on mobile */}
          {width < 1024 && (
            isOpen ? 
              <ChevronUp className={`h-6 w-6 ${styles.iconColor}`} /> 
              : 
              <ChevronDown className={`h-6 w-6 ${styles.iconColor}`} />
          )}
        </button>
        
        {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">

            {helpfulLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block bg-white transition-all duration-300 rounded-lg p-4 shadow-md hover:shadow-lg ${styles.HoverBg} border ${styles.cardBorder}`}
              >
                <div className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${styles.bgLight}`}>
                      <LinkIcon className={`h-5 w-5 shrink-0 ${styles.iconColor}`} />
                    </div>
                    <div>
                      <h3 className={`font-medium ${styles.textColor}`}>
                        {link.title}
                      </h3>
                      <p className={`text-sm ${styles.iconColor}`} dir="rtl">
                        {link.description}
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default HelpfulLinksSection;