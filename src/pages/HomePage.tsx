import Carousel from "@/components/Carousel";
import GameCard from "@/components/GameCard";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Separator } from "@/components/separator";
import { useProvider } from "@/contexts/ProviderContext";
import type { Game as GameType } from "@/types/game";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function HomePage() {
	const { fetchGames, isLoading, error, fetchGamesPaginated } = useProvider();
	const [games, setGames] = useState<GameType[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [isGamesLoading, setIsGamesLoading] = useState(false);

	// Fetch games on component mount
	useEffect(() => {
		const loadGames = async () => {
			setIsGamesLoading(true);
			try {
				const fetchedGames = await fetchGames(1, 20);
				setGames(fetchedGames);

				// Check if there are more games to load
				const paginatedResult = await fetchGamesPaginated(1, 20);
				setHasMore(paginatedResult.hasNextPage);
			} catch (err) {
				console.error("Failed to fetch games:", err);
			} finally {
				setIsGamesLoading(false);
			}
		};

		loadGames();
	}, [fetchGames, fetchGamesPaginated]);

	// Load more games
	const handleLoadMore = async () => {
		if (!hasMore || isGamesLoading) return;

		setIsGamesLoading(true);
		try {
			const nextPage = currentPage + 1;
			const newGames = await fetchGames(nextPage, 20);
			setGames((prevGames) => [...prevGames, ...newGames]);

			// Check if there are more games
			const paginatedResult = await fetchGamesPaginated(nextPage, 20);
			setHasMore(paginatedResult.hasNextPage);
			setCurrentPage(nextPage);
		} catch (err) {
			console.error("Failed to load more games:", err);
		} finally {
			setIsGamesLoading(false);
		}
	};

	// Transform Game type to Carousel game format
	const transformToCarouselGame = (game: GameType) => ({
		id: game.id,
		title: game.title,
		description: game.excerpt || game.description,
		imageUrl: game.coverImage,
	});

	// Transform Game type to GameCard format
	const transformToGameCard = (game: GameType) => ({
		id: game.id,
		title: game.title,
		description: game.excerpt || game.description,
		imageUrl: game.coverImage,
		downloadUrl: game.downloadLinks.find((link) => link.available)?.url,
	});

	// Get carousel games (first 5 games)
	const carouselGames = games.slice(0, 5).map(transformToCarouselGame);

	// Get games for featured tab
	const featuredGames = games.slice(5, 13).map(transformToGameCard);

	// Get games for trending tab
	const trendingGames = games.slice(13, 17).map(transformToGameCard);

	// Get games for new tab
	const newGames = games.slice(17, 21).map(transformToGameCard);

	return (
		<div className="p-8">
			{/* Featured Games Section with Card */}
			<Card className="mb-8 border-onyx-3 bg-onyx-2">
				<CardHeader className="pb-4">
					<CardTitle className="text-pure-white text-xl font-semibold font-inter">
						Son Eklenen Oyunlar
					</CardTitle>
				</CardHeader>
				<CardContent className="pt-0">
					{isGamesLoading && games.length === 0 ? (
						<div className="flex items-center justify-center h-80">
							<Loader2 className="w-8 h-8 text-cool-gray animate-spin" />
						</div>
					) : error ? (
						<div className="flex flex-col items-center justify-center h-80">
							<p className="text-text-gray mb-4">
								Oyunlar yüklenirken bir hata oluştu
							</p>
							<Button
								variant="outline"
								onClick={() => window.location.reload()}
								className="border-onyx-3 text-pure-white hover:bg-onyx"
							>
								Yeniden Dene
							</Button>
						</div>
					) : carouselGames.length > 0 ? (
						<Carousel games={carouselGames} autoPlay={true} interval={4000} />
					) : (
						<div className="flex items-center justify-center h-80">
							<p className="text-text-gray">Henüz oyun bulunmuyor</p>
						</div>
					)}
				</CardContent>
			</Card>

			<Separator className="bg-onyx-3 mb-8" />

			{/* More Games Section - Containerless with 4 items per row */}
			<div>
				{/* Section Title */}
				<div className="flex items-center justify-between mb-6 px-0">
					<h2 className="text-pure-white text-xl font-semibold font-inter">
						Daha Fazla
					</h2>
					<Badge variant="outline" className="text-foreground border-onyx-3">
						{games.length} Oyun
					</Badge>
				</div>

				{/* Games Grid - Full width, no padding */}
				<div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
					{isGamesLoading && games.length === 0 ? (
						<div className="col-span-full flex items-center justify-center h-56">
							<Loader2 className="w-8 h-8 text-cool-gray animate-spin" />
						</div>
					) : featuredGames.length > 0 || trendingGames.length > 0 || newGames.length > 0 ? (
						<>
							{featuredGames.map((game) => (
								<GameCard key={game.id} game={game} />
							))}
							{trendingGames.map((game) => (
								<GameCard key={game.id} game={game} />
							))}
							{newGames.map((game) => (
								<GameCard key={game.id} game={game} />
							))}
						</>
					) : (
						<div className="col-span-full flex items-center justify-center h-56">
							<p className="text-text-gray">Henüz oyun bulunmuyor</p>
						</div>
					)}
				</div>

				{/* Load More Button */}
				{hasMore && games.length > 0 && (
					<div className="flex justify-center mt-6">
						<Button
							onClick={handleLoadMore}
							disabled={isGamesLoading}
							variant="outline"
							className="border-onyx-3 text-pure-white hover:bg-onyx min-w-[150px]"
						>
							{isGamesLoading ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Yükleniyor...
								</>
							) : (
								"Daha Fazla Yükle"
							)}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
