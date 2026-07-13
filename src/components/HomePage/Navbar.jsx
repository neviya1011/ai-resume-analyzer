import { useNavigate } from "react-router-dom";

const Navbar = () => {

  const navigate = useNavigate();

  return (
    <div className="bg-white w-full rounded-2xl p-[10px]">
      <div className="flex justify-between items-baseline flex-wrap gap-2">
        <h1 className="font-bold text-sm sm:text-base">RESUMIND</h1>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/upload")}
            className="bg-[rgb(98,109,210)] rounded-2xl px-2 sm:px-3 py-1 text-[rgb(220,224,250)] text-[10px] sm:text-xs whitespace-nowrap"
          >
            Upload Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;