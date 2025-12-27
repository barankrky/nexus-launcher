import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Progress } from "@/components/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/select";
import { Separator } from "@/components/separator";
import { Switch } from "@/components/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import {
	FolderOpen,
	Globe,
	HardDrive,
	Info,
	Monitor,
	Palette,
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
	const [downloadSpeed, setDownloadSpeed] = useState("unlimited");
	const [concurrentDownloads, setConcurrentDownloads] = useState("3");
	const [language, setLanguage] = useState("tr");
	const [startup, setStartup] = useState(false);
	const [minimizeToTray, setMinimizeToTray] = useState(true);
	const [downloadLocation] = useState("C:\\Users\\nextrobyte\\Games\\Nexus");

	return (
		<div className="p-8">
			{/* Header */}
			<div className="mb-8">
				<h2 className="text-pure-white text-3xl font-bold font-inter">
					Ayarlar
				</h2>
				<p className="text-text-gray mt-2 font-inter">
					Uygulama tercihlerinizi buradan yönetebilirsiniz
				</p>
			</div>

			{/* Settings Tabs */}
			<div className="max-w-4xl">
				<Tabs defaultValue="downloads" className="w-full">
					<TabsList className="bg-onyx-3 border border-onyx">
						<TabsTrigger
							value="downloads"
							className="data-[state=active]:bg-cool-gray data-[state=active]:text-pure-white text-text-gray"
						>
							<FolderOpen size={16} className="mr-2" />
							İndirilebilirler
						</TabsTrigger>
						<TabsTrigger
							value="appearance"
							className="data-[state=active]:bg-cool-gray data-[state=active]:text-pure-white text-text-gray"
						>
							<Palette size={16} className="mr-2" />
							Görünüm
						</TabsTrigger>
						<TabsTrigger
							value="system"
							className="data-[state=active]:bg-cool-gray data-[state=active]:text-pure-white text-text-gray"
						>
							<Monitor size={16} className="mr-2" />
							Sistem
						</TabsTrigger>
						<TabsTrigger
							value="storage"
							className="data-[state=active]:bg-cool-gray data-[state=active]:text-pure-white text-text-gray"
						>
							<HardDrive size={16} className="mr-2" />
							Depolama
						</TabsTrigger>
						<TabsTrigger
							value="about"
							className="data-[state=active]:bg-cool-gray data-[state=active]:text-pure-white text-text-gray"
						>
							<Info size={16} className="mr-2" />
							Hakkında
						</TabsTrigger>
					</TabsList>

					{/* Downloads Tab */}
					<TabsContent value="downloads" className="mt-6">
						<Card className="bg-onyx-2 border-onyx text-pure-white">
							<CardHeader>
								<CardTitle className="flex items-center gap-3">
									<FolderOpen size={24} className="text-cool-gray" />
									<span className="text-xl font-inter">İndirme Ayarları</span>
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Download Location */}
								<div>
									<Label
										htmlFor="download-location"
										className="mb-2 block font-inter"
									>
										İndirme Konumu
									</Label>
									<div className="flex items-center gap-3">
										<Input
											id="download-location"
											value={downloadLocation}
											readOnly
											className="flex-1 bg-onyx-3 border-onyx text-text-gray font-inter"
										/>
										<Button
											variant="outline"
											className="border-cool-gray text-cool-gray hover:bg-cool-gray hover:text-pure-white font-inter"
										>
											<FolderOpen size={16} className="mr-2" />
											Değiştir
										</Button>
									</div>
								</div>

								<Separator className="bg-onyx" />

								{/* Download Speed Limit */}
								<div>
									<Label
										htmlFor="download-speed"
										className="mb-2 block font-inter"
									>
										İndirme Hız Limiti
									</Label>
									<Select
										value={downloadSpeed}
										onValueChange={setDownloadSpeed}
									>
										<SelectTrigger
											id="download-speed"
											className="w-full bg-onyx-3 border-onyx text-pure-white font-inter"
										>
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="bg-onyx-3 border-onyx text-pure-white">
											<SelectItem value="unlimited">Sınırsız</SelectItem>
											<SelectItem value="5">5 MB/s</SelectItem>
											<SelectItem value="10">10 MB/s</SelectItem>
											<SelectItem value="20">20 MB/s</SelectItem>
											<SelectItem value="50">50 MB/s</SelectItem>
										</SelectContent>
									</Select>
								</div>

								{/* Concurrent Downloads */}
								<div>
									<Label
										htmlFor="concurrent-downloads"
										className="mb-2 block font-inter"
									>
										Eşzamanlı İndirme Sayısı
									</Label>
									<Select
										value={concurrentDownloads}
										onValueChange={setConcurrentDownloads}
									>
										<SelectTrigger
											id="concurrent-downloads"
											className="w-full bg-onyx-3 border-onyx text-pure-white font-inter"
										>
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="bg-onyx-3 border-onyx text-pure-white">
											<SelectItem value="1">1</SelectItem>
											<SelectItem value="2">2</SelectItem>
											<SelectItem value="3">3</SelectItem>
											<SelectItem value="5">5</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Appearance Tab */}
					<TabsContent value="appearance" className="mt-6">
						<Card className="bg-onyx-2 border-onyx text-pure-white">
							<CardHeader>
								<CardTitle className="flex items-center gap-3">
									<Palette size={24} className="text-cool-gray" />
									<span className="text-xl font-inter">Görünüm</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								{/* Theme Selection */}
								<div>
									<Label className="mb-3 block font-inter">Tema</Label>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<Card className="bg-onyx-3 border-2 border-cool-gray cursor-pointer hover:border-cool-gray-80 transition-colors">
											<CardContent className="p-4">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 bg-pure-black rounded-full border-2 border-onyx" />
													<div>
														<p className="text-pure-white font-medium font-inter">
															AMOLED Koyu
														</p>
														<p className="text-text-gray text-sm font-inter">
															Seçili
														</p>
													</div>
												</div>
											</CardContent>
										</Card>
										<Card className="bg-onyx-3 border border-onyx opacity-50 cursor-not-allowed">
											<CardContent className="p-4">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 bg-onyx rounded-full border-2 border-onyx-2" />
													<div>
														<p className="text-pure-white font-medium font-inter">
															Koyu
														</p>
														<p className="text-text-gray text-sm font-inter">
															Yakında
														</p>
													</div>
												</div>
											</CardContent>
										</Card>
										<Card className="bg-onyx-3 border border-onyx opacity-50 cursor-not-allowed">
											<CardContent className="p-4">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 bg-gray-200 rounded-full border-2 border-gray-300" />
													<div>
														<p className="text-pure-white font-medium font-inter">
															Açık
														</p>
														<p className="text-text-gray text-sm font-inter">
															Yakında
														</p>
													</div>
												</div>
											</CardContent>
										</Card>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* System Tab */}
					<TabsContent value="system" className="mt-6">
						<Card className="bg-onyx-2 border-onyx text-pure-white">
							<CardHeader>
								<CardTitle className="flex items-center gap-3">
									<Monitor size={24} className="text-cool-gray" />
									<span className="text-xl font-inter">Sistem</span>
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Language */}
								<div>
									<Label htmlFor="language" className="mb-2 block font-inter">
										Dil
									</Label>
									<Select value={language} onValueChange={setLanguage}>
										<SelectTrigger
											id="language"
											className="w-full bg-onyx-3 border-onyx text-pure-white font-inter"
										>
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="bg-onyx-3 border-onyx text-pure-white">
											<SelectItem value="tr">Türkçe</SelectItem>
											<SelectItem value="en">English</SelectItem>
											<SelectItem value="de">Deutsch</SelectItem>
											<SelectItem value="es">Español</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<Separator className="bg-onyx" />

								{/* Startup Behavior */}
								<div className="flex items-center justify-between">
									<div>
										<Label className="font-inter">Başlangıçta Başlat</Label>
										<p className="text-text-gray text-sm font-inter">
											Sistem başladığında otomatik olarak başlat
										</p>
									</div>
									<Switch
										checked={startup}
										onCheckedChange={setStartup}
										className="data-[state=checked]:bg-cool-gray"
									/>
								</div>

								{/* Minimize to Tray */}
								<div className="flex items-center justify-between">
									<div>
										<Label className="font-inter">Tepsiye Küçült</Label>
										<p className="text-text-gray text-sm font-inter">
											Kapatınca tepsiye küçült
										</p>
									</div>
									<Switch
										checked={minimizeToTray}
										onCheckedChange={setMinimizeToTray}
										className="data-[state=checked]:bg-cool-gray"
									/>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Storage Tab */}
					<TabsContent value="storage" className="mt-6">
						<Card className="bg-onyx-2 border-onyx text-pure-white">
							<CardHeader>
								<CardTitle className="flex items-center gap-3">
									<HardDrive size={24} className="text-cool-gray" />
									<span className="text-xl font-inter">Depolama</span>
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<div className="flex justify-between mb-2">
										<Label className="font-inter">C: Sürücüsü</Label>
										<span className="text-text-gray font-inter">
											45.2 GB / 256 GB
										</span>
									</div>
									<Progress
										value={18}
										className="h-3 bg-onyx-3 [&>div]:bg-cool-gray"
									/>
								</div>
								<Button
									variant="ghost"
									className="text-cool-gray hover:text-cool-gray-80 hover:bg-onyx-3 font-inter text-sm"
								>
									Disk Temizle
								</Button>
							</CardContent>
						</Card>
					</TabsContent>

					{/* About Tab */}
					<TabsContent value="about" className="mt-6">
						<Card className="bg-onyx-2 border-onyx text-pure-white">
							<CardHeader>
								<CardTitle className="flex items-center gap-3">
									<Info size={24} className="text-cool-gray" />
									<span className="text-xl font-inter">Hakkında</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-center gap-4 mb-4">
									<div className="w-16 h-16 bg-gradient-to-br from-cool-gray to-onyx rounded-lg flex items-center justify-center">
										<Globe size={32} className="text-pure-white" />
									</div>
									<div>
										<h4 className="text-pure-white font-bold text-xl font-inter">
											Nexus Launcher
										</h4>
										<p className="text-text-gray font-inter">
											Sürüm 1.0.0 "Nebula"
										</p>
									</div>
								</div>
								<p className="text-text-gray font-inter text-sm">
									Modern oyun yönetimi ve indirme platformu. Tüm oyunlarınızı
									tek bir yerden yönetin.
								</p>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
