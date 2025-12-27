import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/card";
import { Calendar, Download, Star } from "lucide-react";

interface Game {
	id: number;
	title: string;
	description: string;
	imageUrl?: string;
	rating?: number;
	releaseDate?: string;
	genre?: string;
	size?: string;
	downloadUrl?: string;
	price?: string;
}

interface CarouselGameCardProps {
	game: Game;
}

export default function CarouselGameCard({ game }: CarouselGameCardProps) {
	return (
		<Card className="relative w-full h-full border-0 bg-transparent">
			{/* Background Image with Overlay */}
			<div className="absolute inset-0">
				{game.imageUrl ? (
					<img
						src={game.imageUrl}
						alt={game.title}
						className="w-full h-full object-cover"
					/>
				) : (
					<div className="w-full h-full bg-gradient-to-br from-carbon-black to-onyx" />
				)}
				{/* Dark overlay for text readability */}
				<div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
			</div>

			{/* Content */}
			<CardContent className="relative z-10 h-full flex flex-col justify-end p-6">
				<div className="max-w-lg">
					{/* Game Title */}
					<h3 className="text-pure-white text-3xl font-bold mb-2 font-inter">
						{game.title}
					</h3>

					{/* Badges */}
					<div className="flex flex-wrap gap-2 mb-3">
						{game.rating && (
							<Badge
								variant="secondary"
								className="bg-onyx/80 text-pure-white border-cool-gray"
							>
								<Star size={12} className="mr-1 fill-pure-white" />
								{game.rating}
							</Badge>
						)}
						{game.releaseDate && (
							<Badge
								variant="secondary"
								className="bg-onyx/80 text-pure-white border-cool-gray"
							>
								<Calendar size={12} className="mr-1" />
								{game.releaseDate}
							</Badge>
						)}
						{game.genre && (
							<Badge
								variant="outline"
								className="text-pure-white border-cool-gray"
							>
								{game.genre}
							</Badge>
						)}
					</div>

					{/* Game Description - Compact */}
					<p className="text-text-gray text-sm mb-3 font-inter line-clamp-2">
						{game.description}
					</p>
				</div>
			</CardContent>

			{/* Download Button - Right Corner */}
			<div className="absolute z-10 bottom-6 right-6">
				<Button className="bg-cool-gray hover:bg-carbon-black text-pure-white rounded-lg">
					<Download size={16} className="mr-2" />
					İndir
				</Button>
			</div>
		</Card>
	);
}
