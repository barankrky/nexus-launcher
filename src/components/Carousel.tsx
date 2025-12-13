import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CarouselGameCard from "./CarouselGameCard";

export interface Game {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  rating?: number;
  releaseDate?: string;
  downloadUrl?: string;
  price?: string;
}

interface CarouselProps {
  games: Game[];
  autoPlay?: boolean;
  interval?: number;
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  interval?: number;
}

export default function Carousel({ games, autoPlay = true, interval = 5000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % games.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + games.length) % games.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!autoPlay) return;

    const slideInterval = setInterval(nextSlide, interval);
    return () => clearInterval(slideInterval);
  }, [autoPlay, interval, games.length]);

  if (games.length === 0) {
    return (
      <div className="bg-carbon-black rounded-lg p-8 text-center">
        <p className="text-text-gray">No games available</p>
      </div>
    );
  }

  return (
    <>
      {/* Carousel Container */}
      <div className="group relative w-full h-80 bg-carbon-black rounded-lg overflow-hidden">
        {/* Carousel Items */}
        <div className="relative w-full h-full">
          {games.map((game, index) => (
            <div
              key={game.id}
              className={`absolute inset-0 transition-opacity duration-500 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              <CarouselGameCard game={game} />
            </div>
          ))}
        </div>

        {/* Navigation Buttons - Visible on carousel hover */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-onyx bg-opacity-75 text-pure-white p-2 rounded-full transition-all duration-200 z-20 opacity-0 group-hover:opacity-100"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-onyx bg-opacity-75 text-pure-white p-2 rounded-full transition-all duration-200 z-20 opacity-0 group-hover:opacity-100"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Dots Indicator - Outside and compact */}
      <div className="flex justify-center mt-3">
        <div className="flex space-x-1">
          {games.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentIndex ? 'bg-cool-gray' : 'bg-text-gray bg-opacity-50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}