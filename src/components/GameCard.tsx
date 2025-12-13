import { Download } from "lucide-react";

interface Game {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  downloadUrl?: string;
}

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <div className="relative w-96 h-56 rounded-lg overflow-hidden group cursor-pointer">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {game.imageUrl ? (
          <img 
            src={game.imageUrl} 
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-carbon-black to-onyx"></div>
        )}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6">
        <div className="max-w-full">
          {/* Game Title */}
          <h3 className="text-pure-white text-base font-bold mb-1 font-inter">{game.title}</h3>
          
          {/* Game Description - Compact */}
          <p className="text-text-gray text-xs mb-3 font-inter line-clamp-2 opacity-80">{game.description}</p>
        </div>
      </div>
      
      {/* Download Button - Right Corner */}
      <div className="absolute z-10 bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button className="bg-cool-gray hover:bg-cool-gray-80 text-pure-white p-2 rounded-lg font-inter font-semibold transition-all duration-200">
          <Download size={16} />
        </button>
      </div>
    </div>
  );
}