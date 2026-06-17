import Places from './Places.jsx';
import ErrorDialog from './Error.jsx';

import {useEffect, useState} from "react";
import {sortPlacesByDistance} from "../loc.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    const getPlacesUrl = 'http://localhost:3000/places';

    async function fetchPlaces() {
      setIsLoading(true);

      try {
        const response = await fetch(getPlacesUrl);

        if (!response.ok) {
          throw new Error()
        }

        const body = await response.json();

        navigator.geolocation.getCurrentPosition((pos) => {
          setAvailablePlaces(sortPlacesByDistance(body.places, pos.coords.latitude, pos.coords.longitude));
          setIsLoading(false);
        });
      } catch (error) {
        setIsLoading(false);
        setError({
          title: error.title || 'Data Fetching Error',
          message: error.message || `Error Occurred Related to Data Fetching: ${getPlacesUrl}`,
        })
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
