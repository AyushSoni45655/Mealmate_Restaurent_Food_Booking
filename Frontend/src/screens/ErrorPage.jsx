
import { Link, useNavigate, useRouteError } from "react-router-dom";

const  ErrorPage = ()=> {
  const error = useRouteError();
  const navigate = useNavigate();
 const back = ()=>{
  navigate(-1);
 }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 text-white p-6">
      
      {/* Hero Image */}
      <img 
        src="https://media.lordicon.com/icons/system/solid/55-error.svg" 
        alt="404 Illustration" 
        className="w-72 md:w-96 mb-8 animate-bounce" 
      />

      {/* Title */}
      <h1 className="text-6xl md:text-8xl font-extrabold drop-shadow-lg">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mt-2">Oops! Page Not Found</h2>

      {/* Dynamic Error Message */}
      <p className="text-center text-lg mt-4 max-w-lg bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl">
        {error?.statusText || error?.message || "The page you're looking for doesn’t exist or has been moved."}
      </p>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <Link 
          to="/" 
          className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-2xl shadow-lg hover:scale-105 transition-transform"
        >
          ⬅ Back Home
        </Link>
        
        <button 
          onClick={back} 
          className="px-6 py-3 bg-black/40 border border-white/30 rounded-2xl hover:bg-black/60 transition"
        >
          🔙 Go Back
        </button>
      </div>

      {/* Footer Note */}
      <p className="mt-10 text-sm opacity-70">Made with ❤️ by Ayush</p>
    </div>
  );
}

export default ErrorPage;