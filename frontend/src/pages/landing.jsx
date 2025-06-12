import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const handleOwnerClick = () => {
    alert('We’re working on it — check back soon');
  };

  const handleParentClick = () => {
    navigate('/home?source=google');
  };

  return (
    <div className="min-h-screen bg-[url('/public/images/bg-landing.jpg')] bg-cover bg-center bg-no-repeat relative overflow-hidden">
      <div className="flex justify-center pt-12">
        <div className="flex flex-col md:flex-row gap-10">
          <button
            onClick={handleOwnerClick}
            className="w-60 h-80 bg-teal-400 text-white font-bold rounded-3xl shadow-xl hover:shadow-2xl hover:bg-teal-600 text-4xl transition-all duration-300 flex items-center justify-center"
          >
            Owner
          </button>
          <button
            onClick={handleParentClick}
            className="w-60 h-80 bg-rose-300 text-white font-bold rounded-3xl shadow-xl hover:shadow-2xl hover:bg-rose-400 text-4xl transition-all duration-300 flex items-center justify-center"
          >
            Parent
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;