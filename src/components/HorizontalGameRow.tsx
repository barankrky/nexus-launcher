import { Button } from "@/components/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import GameCard from "./GameCard";

interface Game {
	id: number;
	title: string;
	description: string;
	imageUrl?: string;
	downloadUrl?: string;
}

interface HorizontalGameRowProps {
	title: string;
	games: Game[];
	autoPlay?: boolean;
	interval?: number;
}

export default function HorizontalGameRow({
	title,
	games,
	autoPlay = true,
	interval = 4000,
}: HorizontalGameRowProps) {
	const [scrollPosition, setScrollPosition] = useState(0);
	const [isUserInteracting, setIsUserInteracting] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const scrollContainer = useCallback(
		(direction: "left" | "right") => {
			const container = containerRef.current;
			if (container) {
				const scrollAmount = 340; // Width of card (320px) + gap (20px)
				const newPosition =
					direction === "left"
						? Math.max(0, scrollPosition - scrollAmount)
						: Math.min(
								container.scrollWidth - container.clientWidth,
								scrollPosition + scrollAmount,
							);

				container.scrollTo({
					left: newPosition,
					behavior: "smooth",
				});
				setScrollPosition(newPosition);
			}
		},
		[scrollPosition],
	);

	const autoScroll = useCallback(() => {
		if (!isUserInteracting && containerRef.current) {
			const container = containerRef.current;
			const maxScroll = container.scrollWidth - container.clientWidth;

			if (scrollPosition >= maxScroll) {
				// Restart from beginning
				container.scrollTo({
					left: 0,
					behavior: "smooth",
				});
				setScrollPosition(0);
			} else {
				// Scroll to next
				scrollContainer("right");
			}
		}
	}, [isUserInteracting, scrollPosition, scrollContainer]);

	useEffect(() => {
		if (!autoPlay) return;

		const scrollInterval = setInterval(autoScroll, interval);

		return () => clearInterval(scrollInterval);
	}, [autoPlay, interval, autoScroll]);

	const canScrollLeft = scrollPosition > 0;
	const canScrollRight = scrollPosition < games.length * 340 - 900; // Approximate calculation

	return (
		<section className="mb-8">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-pure-white text-xl font-semibold font-inter">
					{title}
				</h3>
				<div className="flex gap-2">
					<Button
						onClick={() => {
							scrollContainer("left");
							setIsUserInteracting(true);
							setTimeout(() => setIsUserInteracting(false), 10000); // Resume auto-scroll after 10 seconds
						}}
						disabled={!canScrollLeft}
						variant="ghost"
						size="icon"
						className={`h-8 w-8 rounded-full transition-all duration-200 ${
							canScrollLeft
								? "bg-onyx hover:bg-carbon-black text-pure-white"
								: "bg-onyx/50 text-text-gray cursor-not-allowed"
						}`}
						aria-label="Previous games"
					>
						<ChevronLeft size={18} />
					</Button>
					<Button
						onClick={() => {
							scrollContainer("right");
							setIsUserInteracting(true);
							setTimeout(() => setIsUserInteracting(false), 10000); // Resume auto-scroll after 10 seconds
						}}
						disabled={!canScrollRight}
						variant="ghost"
						size="icon"
						className={`h-8 w-8 rounded-full transition-all duration-200 ${
							canScrollRight
								? "bg-onyx hover:bg-carbon-black text-pure-white"
								: "bg-onyx/50 text-text-gray cursor-not-allowed"
						}`}
						aria-label="Next games"
					>
						<ChevronRight size={18} />
					</Button>
				</div>
			</div>

			<div className="relative">
				<div
					ref={containerRef}
					id={`games-container-${title.replace(/\s+/g, "-").toLowerCase()}`}
					className="flex gap-4 overflow-x-hidden scrollbar-hide"
					onScroll={(e) => {
						setScrollPosition(e.currentTarget.scrollLeft);
						setIsUserInteracting(true);
						setTimeout(() => setIsUserInteracting(false), 10000); // Resume auto-scroll after 10 seconds
					}}
					onMouseEnter={() => setIsUserInteracting(true)}
					onMouseLeave={() => setIsUserInteracting(false)}
				>
					{games.map((game) => (
						<GameCard key={game.id} game={game} />
					))}
				</div>
			</div>
		</section>
	);
}
