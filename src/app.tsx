import { Home, Library, Download, Settings, User } from "lucide-react";
import profilePicture from "@/assets/nextrobyte_profile_picture.png";
import TitleBar from "@/components/TitleBar";
import Carousel from "@/components/Carousel";
import GameCard from "@/components/GameCard";

export default function App() {
  return (
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
        <main className="flex-1 bg-onyx-3 overflow-y-auto min-h-0 custom-scrollbar">
          <div className="p-8">
            {/* Featured Games Section */}
            <section className="mb-8">
              <h3 className="text-pure-white text-xl font-semibold mb-4 font-inter">Son Eklenen Oyunlar</h3>
              <Carousel 
              games={[
                {
                  id: 1,
                  title: "Cyberpunk 2077",
                  description: "Geleceğin distopik dünyasında maceraya atılın. Night City'de hayatta kalmak için her yolu deneyin.",
                  imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726a?w=800&h=400&fit=crop"
                },
                {
                  id: 2,
                  title: "The Witcher 3: Wild Hunt",
                  description: "Efsanevi Witcher Geralt olarak canavarları avlayın ve epik bir hikayeye tanık olun.",
                  imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&h=400&fit=crop"
                },
                {
                  id: 3,
                  title: "Red Dead Redemption 2",
                  description: "Vahşi Batı'da bir haydut olarak yaşayın. Sadakat, ihanet ve hayatta kalma mücadelesi.",
                  imageUrl: "https://images.unsplash.com/photo-1542751373-adc38448a05e?w=800&h=400&fit=crop"
                },
                {
                  id: 4,
                  title: "Elden Ring",
                  description: "FromSoftware'un yeni efsanesi. Açık dünya fantezi RPG'de zorlu mücadeleler sizi bekliyor.",
                  imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop"
                },
                {
                  id: 5,
                  title: "Horizon Zero Dawn",
                  description: "Post-apokaliptik bir dünyada devasa mekanik canavarlarla savaşın.",
                  imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop"
                }
              ]}
              autoPlay={true}
              interval={4000}
            />
            </section>
            
            {/* Daha Fazla Section - Enhanced Grid Layout */}
            <section className="mt-12">
              <h3 className="text-pure-white text-xl font-semibold mb-6 font-inter">Daha Fazla</h3>
              <div className="flex flex-wrap gap-2 lg:gap-3">
                <div className="sm:col-span-2 lg:col-span-1">
                  <GameCard 
                    game={{
                      id: 6,
                      title: "God of War",
                      description: "Kratos'un mitolojik dünyada yeni bir macerasına tanık olun.",
                      imageUrl: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800&h=400&fit=crop"
                    }}
                  />
                </div>
                <GameCard 
                  game={{
                    id: 7,
                    title: "Assassin's Creed Valhalla",
                    description: "Viking olarak İngiltere'yi fethedin ve destansı bir savaşçı olun.",
                    imageUrl: "https://images.unsplash.com/photo-1542751110-97427bb1f311?w=800&h=400&fit=crop"
                  }}
                />
                <GameCard 
                  game={{
                    id: 8,
                    title: "The Last of Us Part II",
                    description: "Hayatta kalma mücadelesi ve intikam hikayesiyle dolu epik yolculuk.",
                    imageUrl: "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&h=400&fit=crop"
                  }}
                />
                <GameCard 
                  game={{
                    id: 9,
                    title: "Marvel's Spider-Man",
                    description: "Örümcek adam olarak New York'ta maceralara atılın.",
                    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0acc2401915?w=800&h=400&fit=crop"
                  }}
                />
                <div className="sm:col-span-2 lg:col-span-1">
                  <GameCard 
                    game={{
                      id: 10,
                      title: "Ghost of Tsushima",
                      description: "Japon samuray kültüründe epik bir savaş hikayesi.",
                      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop"
                    }}
                  />
                </div>
                <GameCard 
                  game={{
                    id: 11,
                    title: "Sekiro: Shadows Die Twice",
                    description: "Japonya'da bir shinobi olarak zorlu mücadeleler sizi bekliyor.",
                    imageUrl: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800&h=400&fit=crop"
                  }}
                />
                <GameCard 
                  game={{
                    id: 12,
                    title: "Dark Souls III",
                    description: "Zorlu ve ödüllendirici bir RPG deneyimi.",
                    imageUrl: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800&h=400&fit=crop"
                  }}
                />
                <div className="sm:col-span-2 lg:col-span-1">
                  <GameCard 
                    game={{
                      id: 13,
                      title: "Bloodborne",
                      description: "Gotik korku ve zorlu savaşlarla dolu unutulmaz bir macera.",
                      imageUrl: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800&h=400&fit=crop"
                    }}
                  />
                </div>
                <GameCard 
                  game={{
                    id: 14,
                    title: "Control",
                    description: "Gizemli bir hükümet kuruluşunun paranormal olayları araştırın.",
                    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0acc2401915?w=800&h=400&fit=crop"
                  }}
                />
                <GameCard 
                  game={{
                    id: 15,
                    title: "Fallout 4",
                    description: "Nükleer savaş sonrası Boston'da hayatta kalma mücadelesi.",
                    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop"
                  }}
                />
                <GameCard 
                  game={{
                    id: 16,
                    title: "The Outer Worlds",
                    description: "Uzay kolonilerinde komik ve tehlikeli maceralara atılın.",
                    imageUrl: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800&h=400&fit=crop"
                  }}
                />
                <GameCard 
                  game={{
                    id: 17,
                    title: "Death Stranding",
                    description: "Kıyamet sonrası Amerika'da bağlantıları yeniden kurma macerası.",
                    imageUrl: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800&h=400&fit=crop"
                  }}
                />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}