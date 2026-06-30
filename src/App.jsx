import {useRef, useState, useCallback, useEffect} from 'react';

import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import ErrorDialog from './components/Error.jsx';
import {fetchUserCardplaces, updateUserCardplaces} from "./httpUtils.js";

function App() {
    const selectedPlace = useRef();

    const [userPlaces, setUserPlaces] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [error, setError] = useState();
    const [updatingSelectedPlacesError, setUpdatingSelectedPlacesError] = useState();

    useEffect(() => {
        async function fetchUserPlaces() {
            try {
                const userCardplaces = await fetchUserCardplaces();
                setUserPlaces(userCardplaces);
            } catch (error) {
                setError({
                    title: error.title || 'Data Fetching Error',
                    message: error.message || `Unknown Error Occurred During Data Fetching`,
                });
            }
        }

        fetchUserPlaces();
    }, []);


    function handleStartRemovePlace(place) {
        setModalIsOpen(true);
        selectedPlace.current = place;
    }

    function handleStopRemovePlace() {
        setModalIsOpen(false);
    }

    async function updateSelectedPlaces(userPlaces, selectedPlace) {
        try {
            await updateUserCardplaces([...userPlaces, selectedPlace]);
        } catch (error) {
            setError({
                title: error.title || 'Data Update Error',
                message: error.message || `Unknown Error Occurred During Data Update`,
            });

            setUserPlaces(userPlaces);
            setUpdatingSelectedPlacesError({
                message: error.message || 'An error occured during updating selected places.'
            });
        }
    }

    function handleSelectPlace(selectedPlace) {
        setUserPlaces((prevPickedPlaces) => {
            if (!prevPickedPlaces) {
                prevPickedPlaces = [];
            }
            if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
                return prevPickedPlaces;
            }
            return [selectedPlace, ...prevPickedPlaces];
        });

        updateSelectedPlaces(userPlaces, selectedPlace);
    }

    const handleRemovePlace = useCallback(async function handleRemovePlace() {
        setUserPlaces((prevPickedPlaces) =>
            prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
        );

        updateSelectedPlaces(userPlaces, null);
        setModalIsOpen(false);
    }, []);

    function handleErrorConfirm() {
        setError(undefined);
    }

    function handleUpdatingSelectedPlacesErrorConfirm() {
        setUpdatingSelectedPlacesError(undefined);
    }

    if (error) {
        return <ErrorDialog title={error.title} message={error.message} onConfirm={handleErrorConfirm}/>
    }

    return (
        <>
            <Modal open={updatingSelectedPlacesError} onClose={handleUpdatingSelectedPlacesErrorConfirm}>
                {updatingSelectedPlacesError &&
                    <ErrorDialog
                        title='An error occured!'
                        message={updatingSelectedPlacesError.message}
                        onConfirm={handleUpdatingSelectedPlacesErrorConfirm}
                    />}
            </Modal>
            <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
                <DeleteConfirmation
                    onCancel={handleStopRemovePlace}
                    onConfirm={handleRemovePlace}
                />
            </Modal>

            <header>
                <img src={logoImg} alt="Stylized globe"/>
                <h1>PlacePicker</h1>
                <p>
                    Create your personal collection of places you would like to visit or
                    you have visited.
                </p>
            </header>
            <main>
                <Places
                    title="I'd like to visit ..."
                    fallbackText="Select the places you would like to visit below."
                    places={userPlaces}
                    onSelectPlace={handleStartRemovePlace}
                />

                <AvailablePlaces onSelectPlace={handleSelectPlace}/>
            </main>
        </>
    );
}

export default App;
