import Places from './Places.jsx';
import ErrorDialog from './Error.jsx';

import {useEffect, useState} from "react";
import {sortPlacesByDistance} from "../loc.js";
import {fetchAllCardplaces} from "../httpUtils.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchPlaces() {
      setIsLoading(true);

      try {
        const cardplaces = await fetchAllCardplaces();

        navigator.geolocation.getCurrentPosition((pos) => {
          setAvailablePlaces(sortPlacesByDistance(cardplaces, pos.coords.latitude, pos.coords.longitude));
          setIsLoading(false);
        });
      } catch (error) {
        setIsLoading(false);
        setError({
          title: error.title || 'Data Fetching Error',
          message: error.message || `Unknown Error Occurred During Data Fetching`,
        });
      }
    }

    fetchPlaces();
  }, []);

  function onErrorDialogConfirm() {
    setError(undefined);
  }

  if (error) {
    return <ErrorDialog title={error.title} message={error.message} onConfirm={onErrorDialogConfirm}/>
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isLoading}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
