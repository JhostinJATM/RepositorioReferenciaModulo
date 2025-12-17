import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import { login } from '../api/authService'

const LoginPage = () => {
  const navigate = useNavigate()
  const setToken = useAuthStore((state) => state.setToken)
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await login(formData)
      const token = response.token || response.accessToken
      
      if (token) {
        setToken(token, response.user)
        navigate('/home')
      } else {
        setError('No se recibió un token válido')
      }
    } catch (err) {
      console.error(err)
      setError('Credenciales inválidas o error en el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-[#191919] text-[#141414] dark:text-white h-screen overflow-hidden flex flex-col md:flex-row font-sans">
      {/* Left Section: Login Form */}
      <div className="w-full md:w-1/2 lg:w-[45%] xl:w-[40%] flex flex-col h-full bg-white dark:bg-[#191919] relative z-10 overflow-y-auto">
        {/* Header / Logo */}
        <header className="flex items-center gap-3 px-8 py-6 md:px-12 md:py-8">
          <div className="size-10 text-[#6425EA] flex items-center justify-center">
            <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z" fill="currentColor"></path>
              <path clipRule="evenodd" d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM4.95178 15.2312L21.4543 41.6973C22.6288 43.5809 25.3712 43.5809 26.5457 41.6973L43.0534 15.223C43.0709 15.1948 43.0878 15.1662 43.104 15.1371L41.3563 14.1648C43.104 15.1371 43.1038 15.1374 43.104 15.1371L43.1051 15.135L43.1065 15.1325L43.1101 15.1261L43.1199 15.1082C43.1276 15.094 43.1377 15.0754 43.1497 15.0527C43.1738 15.0075 43.2062 14.9455 43.244 14.8701C43.319 14.7208 43.4196 14.511 43.5217 14.2683C43.6901 13.8679 44 13.0689 44 12.2609C44 10.5573 43.003 9.22254 41.8558 8.2791C40.6947 7.32427 39.1354 6.55361 37.385 5.94477C33.8654 4.72057 29.133 4 24 4C18.867 4 14.1346 4.72057 10.615 5.94478C8.86463 6.55361 7.30529 7.32428 6.14419 8.27911C4.99695 9.22255 3.99999 10.5573 3.99999 12.2609C3.99999 13.1275 4.29264 13.9078 4.49321 14.3607C4.60375 14.6102 4.71348 14.8196 4.79687 14.9689C4.83898 15.0444 4.87547 15.1065 4.9035 15.1529C4.91754 15.1762 4.92954 15.1957 4.93916 15.2111L4.94662 15.223L4.95178 15.2312ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z" fill="currentColor" fillRule="evenodd"></path>
            </svg>
          </div>
          <h2 className="text-[#141414] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">HoopsApp</h2>
        </header>

        {/* Main Content Wrapper */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-12 lg:px-16 pb-12 max-w-2xl mx-auto w-full">
          {/* Page Heading */}
          <div className="mb-8">
            <h1 className="text-[#141414] dark:text-white text-3xl md:text-4xl font-extrabold leading-tight tracking-[-0.033em] mb-3">Welcome back to the court</h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-base font-normal leading-normal">Enter your details to access your stats and highlights.</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded text-sm text-center">
                {error}
              </div>
            )}

            {/* Email Field */}
            <label className="flex flex-col gap-2">
              <span className="text-[#141414] dark:text-white text-sm font-semibold leading-normal">Email Address / Username</span>
              <input
                className="flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-[#141414] focus:outline-0 focus:ring-2 focus:ring-[#6425EA]/20 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:border-[#6425EA] h-12 placeholder:text-neutral-400 px-4 text-base font-normal transition-all"
                placeholder="player@example.com"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </label>

            {/* Password Field */}
            <label className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-[#141414] dark:text-white text-sm font-semibold leading-normal">Password</span>
              </div>
              <div className="relative flex w-full items-stretch rounded-lg">
                <input
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#141414] focus:outline-0 focus:ring-2 focus:ring-[#6425EA]/20 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:border-[#6425EA] h-12 placeholder:text-neutral-400 px-4 pr-12 text-base font-normal transition-all"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center pr-3">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 focus:outline-none p-1 rounded-md"
                  >
                    <span className="material-icons-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
              <div className="flex justify-end mt-1">
                <a className="text-[#6425EA] hover:text-[#501dbb] text-sm font-medium leading-normal underline decoration-1 underline-offset-4 transition-colors cursor-pointer">Forgot Password?</a>
              </div>
            </label>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center rounded-lg bg-[#6425EA] px-5 py-3.5 text-base font-bold leading-normal text-white hover:bg-[#501dbb] active:scale-[0.98] transition-all shadow-md shadow-[#6425EA]/20 focus:ring-4 focus:ring-[#6425EA]/30 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging In...' : 'Log In'}
            </button>

            {/* Sign Up Prompt */}
            <p className="text-center text-neutral-500 dark:text-neutral-400 text-sm mt-2">
              Don't have an account? <a className="text-[#6425EA] hover:text-[#501dbb] font-semibold hover:underline cursor-pointer">Sign up for free</a>
            </p>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-neutral-200 dark:border-neutral-700"></div>
              <span className="flex-shrink-0 mx-4 text-neutral-400 text-xs uppercase tracking-wider font-medium">Or continue with</span>
              <div className="flex-grow border-t border-neutral-200 dark:border-neutral-700"></div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm font-semibold text-[#141414] dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors" type="button">
                <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVAKuADFuc-L_yRbTxjkPg5GXNF5So0irqLliyaYpx0UkM5q5_9rDOPnI1WQmdIKQtS3JRtFGhB52aBlbWOpw_9xpVDkHODHA-KNjAIrVqv1-4_vK_I9Wn8egwZd5brHYskuLLNVXSbx7io5G6nxInRKcrv5UgFFsxX3MGfdd1UQ5DxvnoOZhpgCp0lk1AxQhhNImD_a4JzkZyiTotaE1748OVk9cGIqDhdv3L_QQDLgSuG4b0NrJtKXPE_HD-9T0EKxq05gDHezbm"/>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm font-semibold text-[#141414] dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors" type="button">
                <span className="material-icons-outlined text-[20px]">phone_iphone</span>
                Apple
              </button>
            </div>
          </form>
        </div>

        {/* Footer Links */}
        <footer className="py-6 px-8 text-center md:text-left text-xs text-neutral-400 flex flex-wrap gap-4 justify-center md:justify-start">
          <a className="hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer">Privacy Policy</a>
          <span className="text-neutral-300 dark:text-neutral-600">•</span>
          <a className="hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer">Terms of Service</a>
        </footer>
      </div>

      {/* Right Section: Image/Visual */}
      <div className="hidden md:block md:w-1/2 lg:w-[55%] xl:w-[60%] h-full relative bg-neutral-900">
        {/* Background Image */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDchEjUjbphfC_n7aiqq6LCM1ui9cY6jAizvrqQyRdnyra14qUOr6CSNm8xJRlY6m3ZZdM0jBNYFO4YwTkx482ZbLWJ8TdrAH3XEYV1Wk8HypjIbeZ8D2qhjxCyJQIGiXwNoc2JuusdRHIqt-XfW1rbkixeRk7QC46Ge2BEP2dNn536fFme8ycB16s7-FSqsisz7xQvUg5YQdqiTdSTOmrSwH8x-wbFrmQg8uWTmZotVs7Ve34tJY7_84MvIHfxooXcw_Aj8zCKxuMu')" }}
        >
        </div>
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#6425EA]/90 via-[#6425EA]/40 to-transparent mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        
        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-12 lg:p-16 text-white z-20">
          <div className="max-w-lg">
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="material-icons-outlined text-yellow-400 text-xl">star</span>
              ))}
            </div>
            <blockquote className="text-2xl lg:text-3xl font-bold leading-tight mb-6 font-display">
              "This app completely changed how I track my shooting percentage. The analytics are game-changing."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30">
                <img alt="Portrait of a male basketball player" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuArkVVexsJTs3CpNreIpnUE2t0y7-oPukACR0pjz9-JTEn6QjygIDnzg8EoWCgIx3ZVuwNr7Hrqhs5_ZGOb__cYG2hS82JVm79F9Q8ZwRCewUAqir71_JDKRU13OFzZOnLKfcX928wbiK2yrczL8fv5hnDYtrBFPxYUeWATL9nn4tKiOO8zRPQQAgZnJZg51bXXMnfrmb9PWudwb9bo7vmTLsh4Dl3bN9TX7CK3PHa0qlsd8q5DyywbhHQ9qjE9XJvA9qg2G2g2ze8B"/>
              </div>
              <div>
                <p className="font-bold text-base">Marcus Thompson</p>
                <p className="text-white/70 text-sm">Point Guard, City League</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
