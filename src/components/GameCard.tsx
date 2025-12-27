import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/card";
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
		<Card className="relative w-96 h-56 overflow-hidden group cursor-pointer border-0 bg-transparent">
			{/* Background Image with Overlay */}
			<div className="absolute inset-0">
				{game.imageUrl ? (
					<img
						src={game.imageUrl}
						alt={game.title}
						className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
					/>
				) : (
					<div className="w-full h-full bg-gradient-to-br from-carbon-black to-onyx" />
				)}
				{/* Dark overlay for text readability */}
				<div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
			</div>

			{/* Content */}
			<CardContent className="relative z-10 h-full flex flex-col justify-end p-6">
				<div className="max-w-full">
					{/* Game Title */}
					<h3 className="text-pure-white text-base font-bold mb-1 font-inter">
						{game.title}
					</h3>

					{/* Game Description - Compact */}
					<p className="text-text-gray text-xs mb-3 font-inter line-clamp-2 opacity-80">
						{game.description}
					</p>
				</div>
			</CardContent>

			{/* Download Button - Right Corner */}
			<div className="absolute z-10 bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
				<Button
					variant="default"
					size="icon"
					className="h-8 w-8 bg-cool-gray hover:bg-carbon-black text-pure-white rounded-lg"
				>
					<Download size={16} />
				</Button>
			</div>
		</Card>
	);
}
