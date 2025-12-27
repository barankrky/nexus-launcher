import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card, CardContent, CardHeader } from "@/components/card";
import { Progress } from "@/components/progress";
import { Separator } from "@/components/separator";
import { Clock, Download, HardDrive, Pause, X } from "lucide-react";

export default function DownloadsPage() {
	return (
		<div className="p-8">
			{/* Header */}
			<div className="mb-8">
				<h2 className="text-pure-white text-3xl font-bold font-inter">
					İndirmeler
				</h2>
				<p className="text-text-gray mt-2 font-inter">
					Aktif indirmeleriniz ve indirme kuyruğunuz burada görüntülenir
				</p>
			</div>

			{/* Active Downloads Section */}
			<section className="mb-12">
				<h3 className="text-pure-white text-xl font-semibold mb-6 font-inter">
					Aktif İndirmeler
				</h3>

				{/* Active Download Item */}
				<Card className="bg-onyx-2 border-onyx">
					<CardHeader className="flex-row items-start justify-between space-y-0 p-6">
						<div className="flex items-center gap-4">
							<div className="w-20 h-12 bg-gradient-to-br from-carbon-black to-onyx rounded overflow-hidden flex-shrink-0">
								<img
									src="https://images.unsplash.com/photo-1550745165-9bc0b252726a?w=200&h=120&fit=crop"
									alt="Game"
									className="w-full h-full object-cover"
								/>
							</div>
							<div>
								<h4 className="text-pure-white font-semibold font-inter">
									Cyberpunk 2077
								</h4>
								<div className="flex items-center gap-2 mt-1">
									<p className="text-text-gray text-sm font-inter">
										45.2 GB / 70.5 GB
									</p>
									<Badge
										variant="default"
										className="bg-cool-gray/20 text-cool-gray border-cool-gray/20"
									>
										Aktif
									</Badge>
								</div>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="icon"
								className="text-pure-white hover:text-cool-gray hover:bg-onyx-3"
							>
								<Pause size={16} />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="text-pure-white hover:text-cool-gray hover:bg-onyx-3"
							>
								<X size={16} />
							</Button>
						</div>
					</CardHeader>

					<CardContent className="p-6 pt-0">
						<div className="mb-2">
							<div className="flex justify-between text-sm mb-2">
								<span className="text-text-gray font-inter">
									64% tamamlandı
								</span>
								<span className="text-text-gray font-inter">~15 dk kaldı</span>
							</div>
							<Progress value={64} className="h-2 bg-onyx-3" />
						</div>

						{/* Download Details */}
						<div className="flex items-center gap-6 text-sm text-text-gray font-inter mt-4">
							<div className="flex items-center gap-2">
								<Download size={14} />
								<span>8.5 MB/s</span>
							</div>
							<div className="flex items-center gap-2">
								<HardDrive size={14} />
								<span>45.2 GB</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</section>

			<Separator className="bg-onyx mb-12" />

			{/* Download Queue Section */}
			<section>
				<h3 className="text-pure-white text-xl font-semibold mb-6 font-inter">
					İndirme Kuyruğu
				</h3>

				{/* Queued Download Item */}
				<Card className="bg-onyx-2 border-onyx opacity-60 mb-4">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="w-20 h-12 bg-gradient-to-br from-carbon-black to-onyx rounded overflow-hidden flex-shrink-0">
									<img
										src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=200&h=120&fit=crop"
										alt="Game"
										className="w-full h-full object-cover"
									/>
								</div>
								<div>
									<h4 className="text-pure-white font-semibold font-inter">
										The Witcher 3: Wild Hunt
									</h4>
									<div className="flex items-center gap-2 mt-1">
										<p className="text-text-gray text-sm font-inter">
											Sırada bekliyor
										</p>
										<Badge
											variant="secondary"
											className="bg-onyx-3 text-text-gray border-onyx-3"
										>
											Kuyrukta
										</Badge>
									</div>
								</div>
							</div>
							<div className="flex items-center gap-2 text-text-gray">
								<div className="flex items-center gap-2 text-sm">
									<Clock size={14} />
									<span>~45 dk</span>
								</div>
								<Button
									variant="ghost"
									size="icon"
									className="text-text-gray hover:text-pure-white hover:bg-onyx-3"
								>
									<X size={16} />
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Empty State */}
				<Card className="border-2 border-dashed border-onyx bg-transparent">
					<CardContent className="py-12">
						<div className="text-center">
							<Download size={48} className="text-onyx mx-auto mb-4" />
							<p className="text-text-gray font-inter">
								Kuyrukta bekleyen indirme yok
							</p>
						</div>
					</CardContent>
				</Card>
			</section>
		</div>
	);
}
