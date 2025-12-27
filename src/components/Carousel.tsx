import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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

export default function Carousel({
	games,
	autoPlay = true,
	interval = 5000,
}: CarouselProps) {
	const [currentIndex, setCurrentIndex] = useState(0);

	const nextSlide = useCallback(() => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % games.length);
	}, [games.length]);

	const prevSlide = useCallback(() => {
		setCurrentIndex(
			(prevIndex) => (prevIndex - 1 + games.length) % games.length,
		);
	}, [games.length]);

	const goToSlide = (index: number) => {
		setCurrentIndex(index);
	};

	useEffect(() => {
		if (!autoPlay) return;

		const slideInterval = setInterval(nextSlide, interval);
		return () => clearInterval(slideInterval);
	}, [autoPlay, interval, nextSlide]);

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
							className={`absolute inset-0 transition-opacity duration-500 ${index === currentIndex ? "opacity-100" : "opacity-0"}`}
						>
							<CarouselGameCard game={game} />
						</div>
					))}
				</div>

				{/* Navigation Buttons - Visible on carousel hover */}
				<Button
					onClick={prevSlide}
					variant="secondary"
					size="icon"
					className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-onyx/75 text-pure-white h-10 w-10 rounded-full transition-all duration-200 z-20 opacity-0 group-hover:opacity-100 hover:bg-carbon-black"
					aria-label="Previous slide"
				>
					<ChevronLeft size={24} />
				</Button>
				<Button
					onClick={nextSlide}
					variant="secondary"
					size="icon"
					className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-onyx/75 text-pure-white h-10 w-10 rounded-full transition-all duration-200 z-20 opacity-0 group-hover:opacity-100 hover:bg-carbon-black"
					aria-label="Next slide"
				>
					<ChevronRight size={24} />
				</Button>
			</div>

			{/* Dots Indicator - Outside and compact */}
			<div className="flex justify-center mt-3">
				<div className="flex space-x-1">
					{games.map((game, index) => (
						<Badge
							key={game.id}
							onClick={() => goToSlide(index)}
							variant={index === currentIndex ? "default" : "outline"}
							className={`w-2 h-2 rounded-full p-0 cursor-pointer transition-all duration-200 ${
								index === currentIndex
									? "bg-cool-gray text-cool-gray border-cool-gray"
									: "bg-text-gray/50 border-text-gray/50 text-transparent"
							}`}
							aria-label={`Go to slide ${index + 1}`}
						/>
					))}
				</div>
			</div>
		</>
	);
}
