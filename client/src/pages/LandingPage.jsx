import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-gray-50 dark:bg-[#191022] font-sans text-slate-900 dark:text-white overflow-x-hidden antialiased selection:bg-purple-600 selection:text-white min-h-screen flex flex-col">
      {/* TopNavBar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#191022]/95 backdrop-blur-sm">
        <div className="px-4 md:px-10 py-3 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600/10 text-purple-600">
              <span className="material-icons-outlined text-3xl">sports_basketball</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">University Hoops</h2>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-sm font-medium hover:text-purple-600 transition-colors cursor-pointer">Home</a>
            <a className="text-sm font-medium hover:text-purple-600 transition-colors cursor-pointer">Team</a>
            <a className="text-sm font-medium hover:text-purple-600 transition-colors cursor-pointer">Schedule</a>
            <a className="text-sm font-medium hover:text-purple-600 transition-colors cursor-pointer">News</a>
            <a className="text-sm font-medium hover:text-purple-600 transition-colors cursor-pointer">Shop</a>
          </nav>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center justify-center rounded-lg h-10 px-6 bg-purple-600 hover:bg-purple-700 transition-colors text-white text-sm font-bold shadow-lg shadow-purple-600/20"
            >
              <span className="truncate">Login</span>
            </button>
            <button className="md:hidden p-2 text-slate-600 dark:text-slate-300">
              <span className="material-icons-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-col w-full flex-1">
        {/* HeroSection */}
        <section className="relative w-full overflow-hidden">
          <div className="px-4 py-8 md:px-10 lg:py-12 max-w-7xl mx-auto">
            <div
              className="relative rounded-2xl overflow-hidden min-h-[500px] flex items-center justify-center bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(rgba(25, 16, 34, 0.4), rgba(25, 16, 34, 0.7)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuA4RFTUxkCfezWEz6ZB_Cqj3lMdURmyjJdMf-gI-5O5oUfJUfuzjOVXSnQMy4P1adBpT-cTOH7_0cOKqqVs05y3iLVUgp44Y5vNp7vnKQ2zkRf_BahlZ44AYRvOpX0OjMQ1PBb9e9AXsuAXWSolD5YPEBctEcY4BMg5EnWSGTq_FeU5GsEpqbgt6j_0AgLzoC-gPp92PkxjQ8BLfFq0MFnbmg-Dgk941uByuYw9bb0wHnFS3v3FAkVZ1KCJ4IB2N7Z-PEEcMytWOBKY')`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#191022]/90 via-transparent to-transparent opacity-80"></div>
              <div className="relative z-10 flex flex-col gap-6 text-center max-w-3xl px-4 animate-fade-in-up">
                <div className="inline-flex items-center justify-center gap-2 px-3 py-1 mx-auto rounded-full bg-purple-600/80 backdrop-blur-md border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Season Starts Oct 24</span>
                </div>
                <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
                  Unite. Compete. <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Conquer.</span>
                </h1>
                <p className="text-slate-200 text-base md:text-lg font-medium leading-relaxed max-w-xl mx-auto">
                  The official home of the University Basketball Club. Join a community of champions, fans, and athletes.
                </p>
                <div className="flex flex-wrap gap-4 justify-center mt-4">
                  <button className="flex items-center justify-center h-12 px-8 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-base font-bold transition-all shadow-lg shadow-purple-600/30 transform hover:-translate-y-0.5">
                    See Match Schedule
                  </button>
                  <button className="flex items-center justify-center h-12 px-8 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-base font-bold transition-all">
                    Join the Club
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto w-full px-4 md:px-10 flex flex-col lg:flex-row gap-8 pb-12">
          {/* Left Column: Upcoming Matches */}
          <div className="flex-1 lg:max-w-md w-full">
            <div className="flex items-center justify-between pb-4 pt-2">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
                <span className="material-icons-outlined text-purple-600">calendar_month</span>
                Upcoming Matches
              </h2>
              <a className="text-sm font-bold text-purple-600 hover:underline cursor-pointer">View All</a>
            </div>
            <div className="bg-white dark:bg-[#2d1f3f] rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="grid grid-cols-[32px_1fr] gap-x-4">
                {/* Match 1 */}
                <div className="flex flex-col items-center pt-2">
                  <span className="material-icons-outlined text-purple-600 text-2xl">sports_basketball</span>
                  <div className="w-0.5 bg-slate-200 dark:bg-slate-700 h-full mt-2"></div>
                </div>
                <div className="pb-8">
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">Home Game</p>
                  <h3 className="text-lg font-bold">vs. Tech State University</h3>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mt-1">
                    <span className="material-icons-outlined text-[18px]">schedule</span>
                    <span>Oct 24 @ 7 PM</span>
                    <span className="text-slate-300 dark:text-slate-600">|</span>
                    <span>Main Gym</span>
                  </div>
                </div>
                {/* Match 2 */}
                <div className="flex flex-col items-center">
                  <div className="w-0.5 bg-slate-200 dark:bg-slate-700 h-3 mb-2"></div>
                  <span className="material-icons-outlined text-slate-400 dark:text-slate-500 text-2xl">directions_bus</span>
                  <div className="w-0.5 bg-slate-200 dark:bg-slate-700 h-full mt-2"></div>
                </div>
                <div className="pb-8">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Away Game</p>
                  <h3 className="text-lg font-bold">vs. City College</h3>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mt-1">
                    <span className="material-icons-outlined text-[18px]">schedule</span>
                    <span>Oct 31 @ 6 PM</span>
                    <span className="text-slate-300 dark:text-slate-600">|</span>
                    <span>CC Arena</span>
                  </div>
                </div>
                {/* Match 3 */}
                <div className="flex flex-col items-center pb-2">
                  <div className="w-0.5 bg-slate-200 dark:bg-slate-700 h-3 mb-2"></div>
                  <span className="material-icons-outlined text-purple-600 text-2xl">sports_basketball</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">Home Game</p>
                  <h3 className="text-lg font-bold">vs. Northern Poly</h3>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mt-1">
                    <span className="material-icons-outlined text-[18px]">schedule</span>
                    <span>Nov 07 @ 7 PM</span>
                    <span className="text-slate-300 dark:text-slate-600">|</span>
                    <span>Main Gym</span>
                  </div>
                </div>
              </div>
              <button className="w-full mt-6 py-3 rounded-lg border border-slate-200 dark:border-slate-700 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Sync to Calendar
              </button>
            </div>
          </div>
          {/* Right Column: News & Team */}
          <div className="flex-[2] w-full flex flex-col gap-10">
            {/* News Section */}
            <div>
              <div className="flex items-center justify-between pb-4 pt-2">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">Club News & Updates</h2>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <span className="material-icons-outlined text-sm">arrow_back</span>
                  </button>
                  <button className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <span className="material-icons-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* News Card 1 */}
                <article className="group cursor-pointer flex flex-col gap-3">
                  <div className="aspect-video w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 relative">
                    <img
                      alt="Basketball team celebrating a victory on court"
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDY8JN8dQNFzPJEIt1SE8lif0yocJSaLbv_jU3YZEh23jtDOb8aFjkrl4EiQXgPp1ZWZkx39bq5GlCGvJ0LtqfiOtPgS6I4_NIHG9Plu1K9QdoqQwsNtD_UoxJOx_IVC3McslLMGTik-rsVU_odLlvvIpbhDm4MwDgnSUHv5O6Jm1F-oeSuaK-SxnCsMFq005WOp9uBmF4ESPd-0oHx_u8gPkL0QBVEf1ksm2w5YSA-YS2VTKSB7lE5udefaxCvvjJxvpobU9qmppUW"
                    />
                    <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">Match Report</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-snug group-hover:text-purple-600 transition-colors">Victory against City College in overtime thriller</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 line-clamp-2">The team secured a dramatic win last night thanks to a buzzer-beater from our captain.</p>
                    <span className="text-xs font-medium text-slate-400 mt-2 block">2 hours ago</span>
                  </div>
                </article>
                {/* News Card 2 */}
                <article className="group cursor-pointer flex flex-col gap-3">
                  <div className="aspect-video w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 relative">
                    <img
                      alt="Coach explaining tactics on a whiteboard"
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSEjedJPILh4Swyzp8ro8L_-B4Q4AVxtfnMqEpTSGzcPV2gXJ8gHkf77WykOLfcfVcFhGPVB0tgmnddyQ1XL1V4nLV2SpgN1tXsi0IFVaFalVlJaOIYdcn9oPED0aBSd3FF7hBFam2zq1p6gWfbWGYoTd59SCKxg71RJe5Bwm_6zFu4YkNp-AraqjcRQfPCyT2XR-OxPfbZ0RXjP-SrLkhvk8kEppjlYIbC1SPIwuQj_S0d7KaGs3Cbhz76zCM7MMA6uXqxTKZ2_NN"
                    />
                    <div className="absolute top-2 left-2 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded">Announcement</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-snug group-hover:text-purple-600 transition-colors">Spring Season Tryouts Announced</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 line-clamp-2">Think you have what it takes? Join us next Tuesday for open tryouts at the Main Gym.</p>
                    <span className="text-xs font-medium text-slate-400 mt-2 block">1 day ago</span>
                  </div>
                </article>
              </div>
            </div>
            {/* Team Spotlight */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight pb-6">Player Spotlight</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
                {/* Player 1 */}
                <div className="min-w-[140px] flex flex-col items-center gap-3 text-center group">
                  <div className="w-24 h-24 rounded-full p-1 border-2 border-purple-600/20 group-hover:border-purple-600 transition-colors">
                    <img
                      alt="Portrait of Marcus Johnson, Team Captain"
                      className="w-full h-full rounded-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfYV2pB-WIbUsuPqZQCvuPZZ6ZuY6by1jmlA9LMV54vcLEWlZYFrn_4sG_kB2WDFar6n9jM_AYvc-Qy5VaKY4XlxzQ6i_iRIWelu7Efcx5DGJdxWyDrLHNC-Pvc75vbhxIkkW782UgM0TIk5fjpDl94zo-Yl8T4X_VvYgBrlz_sB4gwVpPk9RDb0yDdoss-o37Q80Hd23uDsyXnTqZdxkG2WC553WDdorlcKDvLbmSKjzJhF8_llyXn7xFST6auAQCyKZDfZPy7NPM"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Marcus Johnson</p>
                    <p className="text-xs text-purple-600 font-medium">Captain / PG</p>
                  </div>
                </div>
                {/* Player 2 */}
                <div className="min-w-[140px] flex flex-col items-center gap-3 text-center group">
                  <div className="w-24 h-24 rounded-full p-1 border-2 border-transparent group-hover:border-purple-600 transition-colors">
                    <img
                      alt="Portrait of Sarah Davis, Shooting Guard"
                      className="w-full h-full rounded-full object-cover bg-slate-200"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEL7GZfEUdpT-F2tvL-W5Wp_Zxvq-n9aN7aWuz4_YybF45CVRYdESJl-wX7rL9ZftJ-iOyIg46j7FTRYMji2_CPQdGbS1drg6ZL-OSCU4o_fCbo_xBWQy2iwq5a1BgsRPee7oR8L1zOCW3hcfXtUR3feU1Ccr4mhFZ0vb8mcZLQ1shWTCuOeNWZZyfEPuWZYYqjFMlT8UGa2B-lMEUW2Cx3bO_XUKRNOuXj5yGjGEqwZJOSKzC68NTEoB-ZAiP5M7Xv4nfgYlk0BMS"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Sarah Davis</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Shooting Guard</p>
                  </div>
                </div>
                {/* Player 3 */}
                <div className="min-w-[140px] flex flex-col items-center gap-3 text-center group">
                  <div className="w-24 h-24 rounded-full p-1 border-2 border-transparent group-hover:border-purple-600 transition-colors">
                    <img
                      alt="Portrait of David Chen, Center"
                      className="w-full h-full rounded-full object-cover bg-slate-200"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7quEQssGphfI2AaLws_ssBiDt_TpAmheuj73J3RANPB_X18v4L6rdsZB7kyUmvAbAau9wpOgaoJ4VT-nqnNhUPYeRlfX6kJhBnv9W3Xv_EVOh7HJ11WBmKtkZeyblKkA5Y0PWtZ1sjLIwahQkSTzE89PV5u_olT-csyTxYNnD0fHfx2wkk2FBfiBMS8yviVFBJ9XAU7PHa9ELhJciUDLwAIpp_b-UwV2SYnwWwNkLAh4mSRoSBMf6h7ebeCHIUzqil_oTCbcnF-9b"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-sm">David Chen</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Center</p>
                  </div>
                </div>
                {/* Join Card */}
                <div className="min-w-[140px] flex flex-col items-center justify-center gap-2 text-center">
                  <a className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-purple-600 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-purple-600 hover:bg-purple-600/5 transition-all cursor-pointer">
                    <span className="material-icons-outlined text-3xl">add</span>
                  </a>
                  <p className="font-bold text-xs">Join the Roster</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#191022] text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white">
                  <span className="material-icons-outlined text-lg">sports_basketball</span>
                </div>
                <h3 className="text-lg font-bold">Uni Hoops</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Fostering athleticism, teamwork, and school spirit since 1995. Come support your local university team.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-base mb-4">Quick Links</h4>
              <ul className="flex flex-col gap-2 text-sm text-slate-400">
                <li><a className="hover:text-purple-600 transition-colors cursor-pointer">Match Schedule</a></li>
                <li><a className="hover:text-purple-600 transition-colors cursor-pointer">Team Roster</a></li>
                <li><a className="hover:text-purple-600 transition-colors cursor-pointer">Club Shop</a></li>
                <li><a className="hover:text-purple-600 transition-colors cursor-pointer">Alumni</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-base mb-4">Contact Us</h4>
              <ul className="flex flex-col gap-3 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="material-icons-outlined text-lg">location_on</span>
                  <span>Main Campus Gym<br />123 University Ave<br />Cityville, ST 12345</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-icons-outlined text-lg">mail</span>
                  <a className="hover:text-purple-600" href="mailto:contact@unihoops.edu">contact@unihoops.edu</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-base mb-4">Follow Us</h4>
              <div className="flex gap-3">
                <a className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>
                </a>
                <a className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                </a>
                <a className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">© 2024 University Basketball Club. All rights reserved.</p>
            <div className="flex gap-6 text-xs text-slate-500">
              <a className="hover:text-white transition-colors cursor-pointer">Privacy Policy</a>
              <a className="hover:text-white transition-colors cursor-pointer">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
