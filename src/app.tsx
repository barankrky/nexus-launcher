import profilePicture from "@/assets/nextrobyte_profile_picture.png";
import TitleBar from "@/components/TitleBar";
import DownloadsPage from "@/pages/DownloadsPage";
import HomePage from "@/pages/HomePage";
import LibraryPage from "@/pages/LibraryPage";
import SettingsPage from "@/pages/SettingsPage";
import { ProviderContextProvider } from "@/contexts/ProviderContext";
import { Download, Home, Library, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
	BrowserRouter,
	Link,
	Route,
	Routes,
	useLocation,
} from "react-router-dom";

function NavLink({
	to,
	children,
	icon: Icon,
}: { to: string; children: React.ReactNode; icon: LucideIcon }) {
	const location = useLocation();
	const isActive = location.pathname === to;

	return (
		<Link
			to={to}
			className={`flex items-center gap-3 transition-all duration-200 px-4 py-3 rounded-lg text-left ${
				isActive
					? "bg-carbon-black text-pure-white"
					: "text-text-gray hover:bg-carbon-black hover:text-pure-white"
			}`}
		>
			<Icon size={20} className={isActive ? "text-cool-gray" : ""} />
			<span className="font-inter">{children}</span>
		</Link>
	);
}

export default function App() {
	return (
		<ProviderContextProvider>
			<BrowserRouter>
				<div className="bg-pure-black w-screen h-screen flex flex-col">
				{/* Custom Title Bar */}
				<TitleBar />

				{/* Main Content Area */}
				<div className="flex-1 flex overflow-hidden">
					{/* Left Sidebar Navigation */}
					<nav className="w-64 bg-onyx flex flex-col flex-shrink-0">
						{/* User Profile Section */}
						<div className="p-6 border-b border-onyx-2">
							<div className="flex items-center gap-4">
								<img
									src={profilePicture}
									alt="Profile"
									className="w-12 h-12 rounded-full object-cover"
								/>
								<div>
									<p className="text-pure-white font-semibold font-inter">
										nextrobyte
									</p>
									<p className="text-text-gray text-sm">Online</p>
								</div>
							</div>
						</div>

						{/* Main Navigation Items */}
						<div className="flex-1 py-6">
							<div className="flex flex-col gap-2 px-4">
								<NavLink to="/" icon={Home}>
									Ana Sayfa
								</NavLink>
								<NavLink to="/library" icon={Library}>
									Kütüphane
								</NavLink>
							</div>
						</div>

						{/* Bottom Navigation Items */}
						<div className="py-6 border-t border-onyx-2">
							<div className="flex flex-col gap-2 px-4">
								<NavLink to="/downloads" icon={Download}>
									İndirmeler
								</NavLink>
								<NavLink to="/settings" icon={Settings}>
									Ayarlar
								</NavLink>
							</div>

							{/* Version Info */}
							<div className="px-4 mt-6">
								<p className="text-text-gray text-xs font-inter">
									v1.0.0 "Nebula"
								</p>
							</div>
						</div>
					</nav>

					{/* Content Area */}
					<main className="flex-1 bg-onyx-3 overflow-y-auto min-h-0 custom-scrollbar">
						<Routes>
							<Route path="/" element={<HomePage />} />
							<Route path="/library" element={<LibraryPage />} />
							<Route path="/downloads" element={<DownloadsPage />} />
							<Route path="/settings" element={<SettingsPage />} />
						</Routes>
					</main>
				</div>
			</div>
			</BrowserRouter>
		</ProviderContextProvider>
	);
}
