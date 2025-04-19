import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

const baseInstitutes = [
  { id: 1, name: "אוניברסיטת תל אביב", slug: "tel-aviv" },
  { id: 2, name: "הטכניון", slug: "technion" },
  { id: 3, name: "האוניברסיטה העברית", slug: "hebrew" },
  { id: 4, name: "אוניברסיטת חיפה", slug: "haifa" },
  { id: 5, name: "אוניברסיטת בר אילן בר-אילן", slug: "bar-ilan" },
  { id: 6, name: "אוניברסיטת בן גוריון", slug: "bgu" },
  { id: 7, name: "האוניברסיטה הפתוחה", slug: "open" },
  { id: 8, name: "מכון ויצמן", slug: "weizmann" },
  { id: 9, name: "HIT מכון טכנולוגי חולון", slug: "HitPage" },
  { id: 10, name: "שנקר", slug: "shenkar" },
  { id: 11, name: "סמי שמעון", slug: "sami-shamoon" },
  { id: 12, name: "ספיר", slug: "sapir" },
  { id: 13, name: "מכללת רופין המרכז האקדמי רופין", slug: "ruppin" },
  { id: 14, name: "תל חי", slug: "telhai" },
  { id: 15, name: "מכון לב המרכז האקדמי לב", slug: "lev" },
  { id: 16, name: "עזריאלי", slug: "azrieli" },
  { id: 17, name: "וינגייט", slug: "wingate" },
  { id: 18, name: "קיי", slug: "kaye" },
  { id: 19, name: "מכללת אפקה", slug: "afeka" },
  { id: 20, name: "המכללה למנהל", slug: "hamichlala" },
  { id: 21, name: "מכללת הדסה", slug: "hadasa" },
  { id: 22, name: "בית-ברל בית ברל", slug: "berl" },
  { id: 23, name: "עמק יזרעאל", slug: "emek-yizrael" },
  { id: 24, name: "מכללת אורנים", slug: "oranim" },
  { id: 25, name: "אוניברסיטת אריאל", slug: "ariel" },
  { id: 26, name: "מכללת תלפיות", slug: "talpiot" },
  { id: 27, name: "המכללה האקדמית כנרת", slug: "kinneret" },
  { id: 28, name: "המרכז האקדמי פרס", slug: "peres" },
];

const allInstitutes = baseInstitutes.map((inst) => ({
  ...inst,
  logo: `/logos/${inst.slug}.png`,
}));

function getBalancedAngles(n) {
  const angleStep = 360 / n;
  const angles = [];
  for (let i = 0; i < n; i++) {
    const angle = i * angleStep;
    if (i % 2 === 0) {
      angles.unshift(angle);
    } else {
      angles.push(angle);
    }
  }
  return angles;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      setScreenSize({ width, height: window.innerHeight });
      setIsMobile(width < 640);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const filteredInstitutes = allInstitutes.filter((inst) => {
    try {
      const regex = new RegExp(searchQuery, "i");
      return regex.test(inst.name);
    } catch {
      return true;
    }
  });

  const centerSizeH = isMobile ? 120 : 200;
  const centerSizeW = isMobile ? 350 : 200;
  const buttonSize = isMobile ? 60 : 80;
  const baseRadius = centerSizeH / 2 + buttonSize / 2 + 10;
  const circleSpacing = isMobile ? 50 : 80;
  const maxAllowedRadius = Math.min(screenSize.width, screenSize.height) / 2 - buttonSize;

  const buttonsWithPosition = [];
  let counter = 0;
  let ring = 0;
  let remaining = filteredInstitutes.length;

  if (!isMobile) {
    while (remaining > 0) {
      const itemsInRing = 11 + ring * 7;
      const radius = baseRadius + ring * circleSpacing;
      if (radius > maxAllowedRadius) break;

      const currentCount = Math.min(itemsInRing, remaining);
      const angles = getBalancedAngles(currentCount);

      for (let i = 0; i < currentCount && counter < filteredInstitutes.length; i++) {
        const angle = angles[i];
        const rad = (angle * Math.PI) / 180;
        const x = radius * Math.cos(rad);
        const y = radius * Math.sin(rad);

        buttonsWithPosition.push({
          ...filteredInstitutes[counter],
          x,
          y,
        });

        counter++;
      }

      remaining = filteredInstitutes.length - counter;
      ring++;
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-50 via-blue-300 to-sky-50 relative overflow-hidden px-4 py-8">
      <div className={`relative w-full ${isMobile ? "h-auto" : "h-[1000px]"} max-w-[1000px] flex items-center justify-center flex-col gap-4`}>
        <div className="rounded-full bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white flex flex-col items-center justify-center text-center shadow-xl z-10 gap-3 border-2 border-white/50" style={{ width: `${centerSizeW}px`, height: `${centerSizeH}px` }}>
          <div className="text-5xl font-extrabold tracking-tight drop-shadow-md">CS24</div>
          <div className="relative w-[80%] sm:w-[65%] md:w-[55%] lg:w-[65%] max-w-[240px]">
            <input
              type="text"
              placeholder="חפש מוסד..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm pl-10 pr-4 py-2 w-full text-center border-none bg-white text-black rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-all duration-200 placeholder-gray-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {isMobile ? (
          <div className="w-full max-w-md mt-4 grid grid-cols-3 gap-4">
            {filteredInstitutes.map((inst) => (
              <button
                key={inst.slug}
                onClick={() => navigate(`/${inst.slug}`)}
                className="w-full h-full rounded-full bg-white shadow-md border border-blue-200 flex items-center justify-center text-center font-medium overflow-hidden mx-auto transition-opacity duration-500 ease-in-out"
              >
                <img
                  src={inst.logo}
                  alt={inst.name}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const textElement = document.createElement("span");
                    textElement.textContent = inst.name;
                    textElement.className = "text-[12px] px-2";
                    e.currentTarget.parentElement?.appendChild(textElement);
                  }}
                />
              </button>
            ))}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {buttonsWithPosition.map((inst) => (
              <button
                key={inst.slug}
                onClick={() => navigate(`/${inst.slug}`)}
                className="w-20 h-20 absolute rounded-full bg-white shadow-md border border-blue-200 flex items-center justify-center text-center font-medium z-0 overflow-hidden pointer-events-auto transition-transform duration-400 ease-in-out"
                style={{ transform: `translate(${inst.x}px, ${inst.y}px)` }}
              >
                <img
                  src={inst.logo}
                  alt={inst.name}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const textElement = document.createElement("span");
                    textElement.textContent = inst.name;
                    textElement.className = "text-[12px] px-2";
                    e.currentTarget.parentElement?.appendChild(textElement);
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
