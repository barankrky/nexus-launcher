import { Home, Library, Download, Settings, User } from "lucide-react";
import profilePicture from "@/assets/nextrobyte_profile_picture.png";
import TitleBar from "@/components/TitleBar";

export default function App() {
  return (
    <div className="bg-pure-black w-screen h-screen flex flex-col">
      {/* Custom Title Bar */}
      <TitleBar />

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Left Sidebar Navigation */}
        <nav className="w-64 bg-onyx flex flex-col">
          {/* User Profile Section */}
          <div className="p-6 border-b border-onyx-2">
            <div className="flex items-center gap-4">
              <img
                src={profilePicture}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-pure-white font-semibold font-inter">nextrobyte</p>
                <p className="text-text-gray text-sm">Online</p>
              </div>
            </div>
          </div>

          {/* Main Navigation Items */}
          <div className="flex-1 py-6">
            <div className="flex flex-col gap-2 px-4">
              <button className="flex items-center gap-3 text-pure-white hover:bg-carbon-black transition-all duration-200 px-4 py-3 rounded-lg text-left">
                <Home size={20} className="text-cool-gray" />
                <span className="font-inter">Ana Sayfa</span>
              </button>
              <button className="flex items-center gap-3 text-text-gray hover:bg-carbon-black hover:text-pure-white transition-all duration-200 px-4 py-3 rounded-lg text-left">
                <Library size={20} />
                <span className="font-inter">Kütüphane</span>
              </button>
            </div>
          </div>

          {/* Bottom Navigation Items */}
          <div className="py-6 border-t border-onyx-2">
            <div className="flex flex-col gap-2 px-4">
              <button className="flex items-center gap-3 text-text-gray hover:bg-carbon-black hover:text-pure-white transition-all duration-200 px-4 py-3 rounded-lg text-left">
                <Download size={20} />
                <span className="font-inter">İndirmeler</span>
              </button>
              <button className="flex items-center gap-3 text-text-gray hover:bg-carbon-black hover:text-pure-white transition-all duration-200 px-4 py-3 rounded-lg text-left">
                <Settings size={20} />
                <span className="font-inter">Ayarlar</span>
              </button>
            </div>

            {/* Version Info */}
            <div className="px-4 mt-6">
              <p className="text-text-gray text-xs font-inter">v1.0.0 "Nebula"</p>
            </div>
          </div>
        </nav>

        {/* Content Area */}
        <main className="flex-1 bg-onyx-3">
          <div className="p-8">
            <h2 className="text-pure-white text-2xl mb-4 font-inter">Nexus Launcher</h2>
            <p className="text-text-gray font-inter">Oyunlarınız tek bir yerde...</p>
          </div>
        </main>
      </div>
    </div>
  );
}