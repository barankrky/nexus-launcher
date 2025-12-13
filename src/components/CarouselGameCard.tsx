import { Download, Star, Calendar } from "lucide-react";

interface Game {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  rating?: number;
  releaseDate?: string;
  downloadUrl?: string;
  price?: string;
}

interface CarouselGameCardProps {
  game: Game;
}

export default function CarouselGameCard({ game }: CarouselGameCardProps) {
  return (
    <div className="relative w-full h-full">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {game.imageUrl ? (
          <img 
            src={game.imageUrl} 
            alt={game.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-carbon-black to-onyx"></div>
        )}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6">
        <div className="max-w-lg">
          {/* Game Title */}
          <h3 className="text-pure-white text-3xl font-bold mb-2 font-inter">{game.title}</h3>
          
          {/* Game Description - Compact */}
          <p className="text-text-gray text-sm mb-3 font-inter line-clamp-2">{game.description}</p>
        </div>
      </div>
      
      {/* Download Button - Right Corner */}
      <div className="absolute z-10 bottom-6 right-6">
        <button className="bg-cool-gray hover:bg-cool-gray-80 text-pure-white px-4 py-2 rounded-lg font-inter font-semibold transition-all duration-200 flex items-center gap-2">
          <Download size={16} />
          <span className="text-sm">İndir</span>
        </button>
      </div>
    </div>
  );
}