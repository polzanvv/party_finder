import { useLocation } from 'react-router-dom';

const VenueDetails = () => {
  const { state } = useLocation();
  const venue = state?.venue;

  if (!venue) return <p>No venue data</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{venue.name}</h1>
      <p className="text-gray-700 mb-2">{venue.address || venue.location}</p>
      <p className="text-yellow-600">Rating: {venue.rating || 'N/A'}</p>
      {/* Добавь больше инфы при необходимости */}
    </div>
  );
};

export default VenueDetails;