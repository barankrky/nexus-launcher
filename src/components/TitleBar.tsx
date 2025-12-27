import nexusIcon from "@/assets/nexus_icon.png";
import { Button } from "@/components/button";
import { Maximize2, Minimize, Square, X } from "lucide-react";
import { useEffect, useState } from "react";

interface WindowAPI {
	minimizeWindow: () => Promise<void>;
	maximizeWindow: () => Promise<void>;
	closeWindow: () => Promise<void>;
	isMaximized: () => Promise<boolean>;
}

declare global {
	interface Window {
		windowAPI: WindowAPI;
	}
}

export default function TitleBar() {
	const [isMaximized, setIsMaximized] = useState(false);

	useEffect(() => {
		const checkMaximized = async () => {
			if (window.windowAPI) {
				const maximized = await window.windowAPI.isMaximized();
				setIsMaximized(maximized);
			}
		};

		checkMaximized();

		// Check maximize state periodically in case it changes via other means
		const interval = setInterval(checkMaximized, 1000);
		return () => clearInterval(interval);
	}, []);

	const handleMinimize = async () => {
		if (window.windowAPI) {
			try {
				await window.windowAPI.minimizeWindow();
			} catch (error) {
				// Error handling for minimize operation
			}
		}
	};

	const handleMaximize = async () => {
		if (window.windowAPI) {
			try {
				await window.windowAPI.maximizeWindow();
				// Update state after maximize operation
				const maximized = await window.windowAPI.isMaximized();
				setIsMaximized(maximized);
			} catch (error) {
				// Error handling for maximize operation
			}
		}
	};

	const handleClose = async () => {
		if (window.windowAPI) {
			try {
				await window.windowAPI.closeWindow();
			} catch (error) {
				// Error handling for close operation
			}
		}
	};

	return (
		<div
			className="bg-onyx h-8 flex items-center px-4 select-none"
			style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
		>
			{/* Left: Nexus Icon */}
			<img
				src={nexusIcon}
				alt="Nexus Launcher"
				className="w-4 h-4"
				style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
			/>

			{/* Center: Title */}
			<div className="flex-1 text-center">
				<span className="text-pure-white text-sm font-inter">
					Nexus Launcher
				</span>
			</div>

			{/* Right: Window Controls */}
			<div
				className="flex gap-1"
				style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
			>
				{/* Minimize Button */}
				<Button
					variant="ghost"
					size="icon"
					onClick={handleMinimize}
					className="h-8 w-8 hover:bg-carbon-black"
					title="Minimize"
				>
					<Minimize size={14} className="text-pure-white" />
				</Button>

				{/* Maximize/Restore Button */}
				<Button
					variant="ghost"
					size="icon"
					onClick={handleMaximize}
					className="h-8 w-8 hover:bg-carbon-black"
					title={isMaximized ? "Restore" : "Maximize"}
				>
					{isMaximized ? (
						<Maximize2 size={14} className="text-pure-white" />
					) : (
						<Square size={14} className="text-pure-white" />
					)}
				</Button>

				{/* Close Button */}
				<Button
					variant="ghost"
					size="icon"
					onClick={handleClose}
					className="h-8 w-8 hover:bg-red-600 text-pure-white"
					title="Close"
				>
					<X size={14} className="text-pure-white" />
				</Button>
			</div>
		</div>
	);
}
