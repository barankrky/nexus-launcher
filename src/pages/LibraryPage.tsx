import { Badge } from "@/components/badge";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/card";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/select";
import { useProvider } from "@/contexts/ProviderContext";
import type { Category, Game as GameType } from "@/types/game";
import { Download, Loader2, Play, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

interface LibraryGame {
	id: number;
	title: string;
	description: string;
	imageUrl?: string;
	downloadUrl?: string;
	status: "installed" | "update-available" | "downloading";
	size?: string;
	playTime?: string;
	dateInstalled?: string;
	publishedDate?: string;
	author?: string;
	categories?: string[];
}

export default function LibraryPage() {
	const {
		fetchGames,
		fetchCategories,
		isLoading: providerLoading,
		error: providerError,
	} = useProvider();
	const [libraryGames, setLibraryGames] = useState<LibraryGame[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState("name");
	const [categories, setCategories] = useState<Category[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<string>("all");

	// Fetch library games on mount
	useEffect(() => {
		const loadLibraryGames = async () => {
			setIsLoading(true);
			setError(null);
			try {
				// Fetch games from API
				const games = await fetchGames(1, 50);

				// Transform API games to library format
				const transformedGames: LibraryGame[] = games.map((game) => ({
					id: game.id,
					title: game.title,
					description: game.excerpt || game.description,
					imageUrl: game.coverImage || game.thumbnail,
					downloadUrl: game.downloadLinks[0]?.url,
					status: "installed", // Default status for library games
					size: "N/A", // Size not available from API
					playTime: "N/A", // Play time not available from API
					dateInstalled: game.publishedDate,
					publishedDate: game.publishedDate,
					author: game.author.name,
					categories: game.categories.map((cat) => cat.name),
				}));

				setLibraryGames(transformedGames);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to load library games",
				);
				console.error("Error loading library games:", err);
			} finally {
				setIsLoading(false);
			}
		};

		loadLibraryGames();
	}, [fetchGames]);

	// Fetch categories on mount
	useEffect(() => {
		const loadCategories = async () => {
			try {
				const cats = await fetchCategories();
				setCategories(cats);
			} catch (err) {
				console.error("Error loading categories:", err);
			}
		};

		loadCategories();
	}, [fetchCategories]);

	const getBadgeVariant = (status: LibraryGame["status"]) => {
		switch (status) {
			case "installed":
				return "default";
			case "update-available":
				return "secondary";
			case "downloading":
				return "outline";
			default:
				return "default";
		}
	};

	const getStatusText = (status: LibraryGame["status"]) => {
		switch (status) {
			case "installed":
				return "Yüklü";
			case "update-available":
				return "Güncelleme Mevcut";
			case "downloading":
				return "İndiriliyor";
			default:
				return "";
		}
	};

	const getActionIcon = (status: LibraryGame["status"]) => {
		switch (status) {
			case "installed":
				return <Play size={16} />;
			case "update-available":
				return <RefreshCw size={16} />;
			case "downloading":
				return <Download size={16} />;
			default:
				return <Play size={16} />;
		}
	};

	const getActionText = (status: LibraryGame["status"]) => {
		switch (status) {
			case "installed":
				return "Oyna";
			case "update-available":
				return "Güncelle";
			case "downloading":
				return "İndiriliyor...";
			default:
				return "Oyna";
		}
	};

	// Filter and sort games
	const filteredGames = [...libraryGames].filter((game) => {
		const matchesSearch = game.title
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
		const matchesCategory =
			selectedCategory === "all" ||
			game.categories?.some(
				(cat) => cat.toLowerCase() === selectedCategory.toLowerCase(),
			);
		return matchesSearch && matchesCategory;
	});

	const sortedGames = [...filteredGames].sort((a, b) => {
		switch (sortBy) {
			case "name":
				return a.title.localeCompare(b.title);
			case "date-installed":
			case "date-published":
				return (
					new Date(b.dateInstalled || b.publishedDate || "").getTime() -
					new Date(a.dateInstalled || a.publishedDate || "").getTime()
				);
			case "date-published-asc":
				return (
					new Date(a.dateInstalled || a.publishedDate || "").getTime() -
					new Date(b.dateInstalled || b.publishedDate || "").getTime()
				);
			case "author":
				return (a.author || "").localeCompare(b.author || "");
			default:
				return 0;
		}
	});

	// Loading state
	if (isLoading) {
		return (
			<div className="p-8 min-h-screen bg-onyx flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="w-12 h-12 animate-spin text-cool-gray mx-auto mb-4" />
					<p className="text-pure-white font-inter">Kütüphane yükleniyor...</p>
				</div>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="p-8 min-h-screen bg-onyx flex items-center justify-center">
				<div className="text-center max-w-md">
					<p className="text-red-400 font-inter mb-4">{error}</p>
					<button
						type="button"
						onClick={() => window.location.reload()}
						className="px-4 py-2 bg-cool-gray text-pure-white rounded-lg hover:bg-cool-gray/80 font-inter"
					>
						Yeniden Dene
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="p-8 min-h-screen bg-onyx">
			{/* Header */}
			<div className="mb-8">
				<h2 className="text-pure-white text-3xl font-bold font-inter">
					Kütüphane
				</h2>
				<p className="text-text-gray mt-2 font-inter">
					İndirilen oyunlarınız burada görüntülenir
				</p>
			</div>

			{/* Search and Filter Controls */}
			<div className="mb-8 space-y-6">
				<div className="flex flex-wrap gap-6">
					{/* Search */}
					<div className="space-y-2 max-w-md flex-1 min-w-[250px]">
						<Label htmlFor="search" className="text-pure-white">
							Oyun Ara
						</Label>
						<Input
							id="search"
							type="text"
							placeholder="Oyun ismiyle arayın..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="bg-carbon-black border-cool-gray text-pure-white placeholder:text-text-gray focus:border-cool-gray focus:ring-cool-gray"
						/>
					</div>

					{/* Sort */}
					<div className="space-y-2 max-w-xs flex-1 min-w-[200px]">
						<Label htmlFor="sort" className="text-pure-white">
							Sırala
						</Label>
						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger
								id="sort"
								className="bg-carbon-black border-cool-gray text-pure-white focus:border-cool-gray focus:ring-cool-gray"
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="bg-carbon-black border-cool-gray text-pure-white">
								<SelectItem
									value="name"
									className="hover:bg-onyx focus:bg-onyx"
								>
									İsim
								</SelectItem>
								<SelectItem
									value="date-published"
									className="hover:bg-onyx focus:bg-onyx"
								>
									Yayın Tarihi (Yeniden Eskiye)
								</SelectItem>
								<SelectItem
									value="date-published-asc"
									className="hover:bg-onyx focus:bg-onyx"
								>
									Yayın Tarihi (Eskiden Yeniye)
								</SelectItem>
								<SelectItem
									value="author"
									className="hover:bg-onyx focus:bg-onyx"
								>
									Yazar
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Category Filter */}
					<div className="space-y-2 max-w-xs flex-1 min-w-[200px]">
						<Label htmlFor="category" className="text-pure-white">
							Kategori
						</Label>
						<Select
							value={selectedCategory}
							onValueChange={setSelectedCategory}
						>
							<SelectTrigger
								id="category"
								className="bg-carbon-black border-cool-gray text-pure-white focus:border-cool-gray focus:ring-cool-gray"
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="bg-carbon-black border-cool-gray text-pure-white">
								<SelectItem value="all" className="hover:bg-onyx focus:bg-onyx">
									Tümü
								</SelectItem>
								{categories.map((category) => (
									<SelectItem
										key={category.id}
										value={category.name}
										className="hover:bg-onyx focus:bg-onyx"
									>
										{category.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			{/* Library Games Grid */}
			<section>
				<h3 className="text-pure-white text-xl font-semibold mb-6 font-inter">
					İndirilen Oyunlar{" "}
					{sortedGames.length > 0 && `(${sortedGames.length})`}
				</h3>

				{sortedGames.length === 0 ? (
					<div className="text-center py-12">
						<p className="text-text-gray font-inter">
							Aramanızla eşleşen oyun bulunamadı.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
						{sortedGames.map((game) => (
							<Card
								key={game.id}
								className="bg-carbon-black border-cool-gray overflow-hidden hover:border-cool-gray/80 transition-all duration-300 group"
							>
								{/* Game Image */}
								<CardHeader className="p-0">
									<div className="relative h-48 overflow-hidden">
										{game.imageUrl ? (
											<img
												src={game.imageUrl}
												alt={game.title}
												className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
											/>
										) : (
											<div className="w-full h-full bg-gradient-to-br from-carbon-black to-onyx" />
										)}
										{/* Status Badge */}
										<div className="absolute top-3 left-3">
											<Badge
												variant={getBadgeVariant(game.status)}
												className="bg-onyx/90 border-cool-gray text-pure-white backdrop-blur-sm"
											>
												{getStatusText(game.status)}
											</Badge>
										</div>
									</div>
								</CardHeader>

								{/* Game Content */}
								<CardContent className="p-4">
									<CardTitle className="text-pure-white text-lg font-bold mb-2 font-inter line-clamp-1">
										{game.title}
									</CardTitle>
									<p className="text-text-gray text-sm font-inter line-clamp-2 mb-3 opacity-80">
										{game.description}
									</p>

									{/* Game Info */}
									<div className="flex flex-wrap gap-3 text-xs">
										{game.author && (
											<span className="text-text-gray font-inter">
												<span className="text-cool-gray">Yazar:</span>{" "}
												{game.author}
											</span>
										)}
										{game.publishedDate && (
											<span className="text-text-gray font-inter">
												<span className="text-cool-gray">Yayın Tarihi:</span>{" "}
												{new Date(game.publishedDate).toLocaleDateString(
													"tr-TR",
												)}
											</span>
										)}
										{game.dateInstalled && (
											<span className="text-text-gray font-inter">
												<span className="text-cool-gray">Yükleme Tarihi:</span>{" "}
												{new Date(game.dateInstalled).toLocaleDateString(
													"tr-TR",
												)}
											</span>
										)}
										{game.categories && game.categories.length > 0 && (
											<span className="text-text-gray font-inter">
												<span className="text-cool-gray">Kategoriler:</span>{" "}
												{game.categories.slice(0, 2).join(", ")}
												{game.categories.length > 2 && "..."}
											</span>
										)}
									</div>
								</CardContent>

								{/* Action Button */}
								<CardFooter className="p-4 pt-0">
									<button
										type="button"
										className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-inter font-semibold transition-all duration-200 ${
											game.status === "downloading"
												? "bg-cool-gray/50 text-pure-white cursor-not-allowed"
												: "bg-cool-gray hover:bg-cool-gray/80 text-pure-white"
										}`}
										disabled={game.status === "downloading"}
									>
										{getActionIcon(game.status)}
										{getActionText(game.status)}
									</button>
								</CardFooter>
							</Card>
						))}
					</div>
				)}
			</section>
		</div>
	);
}
