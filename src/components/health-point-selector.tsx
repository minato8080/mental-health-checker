import { useState } from "react";

import { Heart } from "lucide-react";

interface HealthPointSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export function HealthPointSelector({
  value,
  onChange,
}: HealthPointSelectorProps) {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <Heart
          key={i}
          className={`w-6 h-6 cursor-pointer transition-colors ${
            i <= (hoverValue || value)
              ? "text-pink-500 fill-pink-500"
              : "text-gray-300"
          }`}
          onMouseEnter={() => setHoverValue(i)}
          onMouseLeave={() => setHoverValue(0)}
          onClick={() => onChange(i)}
        />
      ))}
    </div>
  );
}
