import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from './ui/card';
import { courseStyles } from '../config/courseStyles';

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

  const csHelpfulLinks = [
    { 
      title: "דרייב האגודה",
      description: "מערכת הקורסים של המכון",
      url: "https://drive.google.com/drive/folders/1ITwPTm_Jv3w-nVT7PpE2HViDn56W_VWN"
    },
    { 
      title: "האתר של קנציפר",
      description: "כל החומר של הסתברות מהאתר הרשמי של ראש הקורס",
      url: "https://eugenekanzieper.faculty.hit.ac.il/probability.html"
    },
    /*{
      title: "cs20",
      description: "דרייב ישן יותר של מבחנים",
      url: "https://drive.google.com/drive/u/1/folders/1Mmh1MW_zwNyqhNDB1gtkeklA4w_kHV5V"
    },*/
    {
      title: "חומרים בטלגרם",
      description: "יש גם בוט בנוסף: @Hithelpbot (לא קשור לאתר)" ,
      url: "https://t.me/+1afwRPetXHA0NGFk"
    },
    {
      title: "הדרייב של ליז",
      description: "מומלץ להעזר בה, המון המון שיטות וחומרים",
      url: "https://drive.google.com/drive/folders/1amxc9ZpT5xzNFdFeYSndfhn32GlebnvG"
    },
    { 
      title: "הדרייב של אלעד עטייא",
      description: "למי שרוצה לעשות ארגזים בהייטקס",
      url: "https://drive.google.com/drive/u/0/folders/1EOpfuGEXp-hCD_DCBYerJiXP-YIrIfnB"
    },
    {
      title: "הדרייב של נועה ארליכמן",
      description: "סיכומים ברמה בינלאומית",
      url: "https://drive.google.com/drive/folders/1s1BBsq2UwPZDvdnMSgYlNuuzXpRThx2m"
    }
    
  ]

  const eeHelpfulLinks = [
    { 
      title: "הדרייב של ברי",
      description: "אוסף חומרים של תואר ראשון + שני + אנגלית",
      url: "https://hitacil-my.sharepoint.com/:f:/g/personal/barucha_my_hit_ac_il/EqjpWXqEQuJDrM9DEFdaWJEBjRCI-d2RyvXBUvd63fpVyA?e=A0f7V2"
    },
    { 
      title: "המחברת של קטיה",
      description: "מחברת עם מבחנים + סיכומים מצויינים",
      url: "https://drive.google.com/drive/folders/1eXdhutwMxoDq44mqden7XX1XzELHcDMA?usp=drive_link"
    },
    { 
      title: "דרייב האגודה",
      description: "מערכת הקורסים של המכון",
      url: "https://drive.google.com/drive/folders/1TgEOORibOMMwWAyg7u5KGvORPMr-ZiHH"
    },
    {
      title: "הדרייב של אלעד עטייא",
      description: "למי שרוצה לעשות ארגזים בהייטקס",
      url: "https://drive.google.com/drive/u/0/folders/1EOpfuGEXp-hCD_DCBYerJiXP-YIrIfnB"
    },
    {
      title: "הדרייב של ליז",
      description: "מומלץ להעזר בה, המון המון שיטות וחומרים",
      url: "https://drive.google.com/drive/folders/1amxc9ZpT5xzNFdFeYSndfhn32GlebnvG"
    },
    {
      title: "הדרייב המטורף של יצחקי",
      description: "דרייב מוכר ומומלץ",
      url: "https://drive.google.com/drive/folders/1k1v7NmfMWPUfA39JKskv0ID6X9udL7xT"
    },
  ]
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
                      <p className={`text-sm ${styles.textColor}`} dir="rtl">
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