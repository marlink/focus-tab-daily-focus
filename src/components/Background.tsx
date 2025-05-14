
import { useEffect, useState } from 'react';

// Array of background images
const backgrounds = [
  { 
    id: 1, 
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80",
    alt: "Circuit board macro photography" 
  },
  { 
    id: 2, 
    url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1920&q=80", 
    alt: "Modern laptop" 
  },
  { 
    id: 3, 
    url: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=1920&q=80", 
    alt: "Starry night" 
  },
  { 
    id: 4, 
    url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1920&q=80", 
    alt: "Green mountains" 
  }
];

interface BackgroundProps {
  mode: 'image' | 'color';
  colorTheme?: string;
}

const Background = ({ mode, colorTheme = '#f1f0fb' }: BackgroundProps) => {
  const [currentBackground, setCurrentBackground] = useState(backgrounds[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Randomly select a background on component mount
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    setCurrentBackground(backgrounds[randomIndex]);
    
    // Preload the image
    const img = new Image();
    img.src = backgrounds[randomIndex].url;
    img.onload = () => setIsLoading(false);
  }, []);

  if (mode === 'color') {
    return (
      <div 
        className="fixed inset-0 w-full h-full transition-colors duration-500" 
        style={{ backgroundColor: colorTheme }}
      />
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {isLoading ? (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      ) : (
        <img 
          src={currentBackground.url} 
          alt={currentBackground.alt}
          className="w-full h-full object-cover animate-fade-in"
        />
      )}
      <div className="absolute inset-0 bg-black/10 dark:bg-black/40" />
    </div>
  );
};

export default Background;
