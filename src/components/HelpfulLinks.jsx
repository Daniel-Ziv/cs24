import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { Card} from './ui/card'

const HelpfulLinksSection = ({ courseType }) => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
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
    {
      title: "cs20",
      description: "דרייב ישן יותר של מבחנים",
      url: "https://drive.google.com/drive/u/1/folders/1Mmh1MW_zwNyqhNDB1gtkeklA4w_kHV5V"
    },
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
    }
  ]

  const eeHelpfulLinks = [
    { 
      title: "הדרייב של ברי",
      description: "אוסף חומרים של תואר ראשון + שני + אנגלית",
      url: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב&sortField=LinkFilename&isAscending=true&ga=1"
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
  

  const helpfulLinks = courseType === 'cs' ? csHelpfulLinks : eeHelpfulLinks;

  return (
    <Card className={`mb-4 bg-white ${courseType === 'cs' ? 'border-blue-200' : 'border-purple-200'}`}>
      <div className={`p-3 ${courseType === 'cs' ? 'bg-blue-100' : 'bg-purple-100'}`}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2">
            <LinkIcon className={`h-6 w-6 ${courseType === 'cs' ? 'text-blue-600' : 'text-purple-600'}`} />
            <h2 className={`text-2xl font-semibold ${courseType === 'cs' ? 'text-blue-950' : 'text-purple-950'}`}>
              קישורים שיכולים לעזור
            </h2>
          </div>
          {isOpen ? 
            <ChevronUp className={`h-6 w-6 ${courseType === 'cs' ? 'text-blue-600' : 'text-purple-600'}`} /> 
            : 
            <ChevronDown className={`h-6 w-6 ${courseType === 'cs' ? 'text-blue-600' : 'text-purple-600'}`} />
          }
        </button>
        
        {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">

            {helpfulLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block bg-white transition-all duration-300 rounded-lg p-4 shadow-md hover:shadow-lg ${courseType === 'cs' ? 'hover:bg-blue-50 border border-blue-200' : 'hover:bg-purple-50 border border-purple-200'}`}
              >
                <div className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${courseType === 'cs' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                      <LinkIcon className={`h-5 w-5 shrink-0 ${courseType === 'cs' ? 'text-blue-800' : 'text-purple-800'}`} />
                    </div>
                    <div>
                      <h3 className={`font-medium ${courseType === 'cs' ? 'text-blue-900' : 'text-purple-900'}`}>
                        {link.title}
                      </h3>
                      <p className={`text-sm ${courseType === 'cs' ? 'text-blue-700' : 'text-purple-700'}`} dir="rtl">
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