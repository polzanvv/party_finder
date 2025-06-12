import { useNavigate } from 'react-router-dom';

const VenueListItem = ({ venue }) => {
  const navigate = useNavigate();

  const handleOpenVenue = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login', { state: { from: '/venues' } });
      return;
    }

    navigate(`/venues/${venue._id}`);
  };

  return (
    <div
      onClick={handleOpenVenue}
      style={{ cursor: 'pointer', border: '1px solid #ccc', padding: 10, marginBottom: 8 }}
    >
      <h3>{venue.name}</h3>
      <p>{venue.address || venue.location || 'Address unknown'}</p>
    </div>
  );
};

export default VenueListItem;