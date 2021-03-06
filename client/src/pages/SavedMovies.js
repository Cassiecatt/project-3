import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import { getMe, deleteMovie } from '../utils/API';
import Auth from '../utils/auth';
import { removeMovieId } from '../utils/localStorage';

const SavedMovies = () => {
    const [userData, setUserData] = useState({});

    // use this to determine if `useEffect()` hook needs to run again
    const userDataLength = Object.keys(userData).length;

    useEffect(() => {
        const getUserData = async () => {
            try {
                const token = Auth.loggedIn() ? Auth.getToken() : null;

                if (!token) {
                    return false;
                }

                const response = await getMe(token);
                console.log(response);

                if (!response.ok) {
                    throw new Error('something went wrong!');
                }

                const user = await response.json();
                console.log(user);
                setUserData(user);
            } catch (err) {
                console.error(err);
            }
        };

        getUserData();
    }, [userDataLength]);

    // create function that accepts the book's mongo _id value as param and deletes the book from the database
    const handleDeleteMovie = async (movieId) => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
            return false;
        }

        try {
            const response = await deleteMovie(movieId, token);

            if (!response.ok) {
                throw new Error('something went wrong!');
            }

            const updatedUser = await response.json();
            setUserData(updatedUser);
            // upon success, remove book's id from localStorage
            removeMovieId(movieId);
        } catch (err) {
            console.error(err);
        }
    };

    // if data isn't here yet, say so
    if (!userDataLength) {
        return <h2>No movies added to watchlist</h2>;
    }

    //JUST NEEDS THE RETURN WITH HTML
    return (
        <>
            <Jumbotron fluid className='text-light bg-dark'>
                <Container>
                    <h1>Viewing {userData.username}'s movies!</h1>
                </Container>
            </Jumbotron>
            <Container>
                <h2>
                    {userData.savedMovies?.length
                        ? `Viewing ${userData.savedMovies.length} saved ${userData.savedMovies.length === 1 ? 'movie' : 'movies'
                        }:`
                        : 'You have no saved movies!'}
                </h2>
                <CardColumns>
                    {userData.savedMovies?.map((movie) => {
                        return (
                            <Card key={movie.movieId} border='dark'>
                                {movie.image ? (
                                    <Card.Img src={movie.poster} alt={`The cover for ${movie.title}`} variant='top' />
                                ) : null}
                                <Card.Body>
                                    <Card.Title>{movie.title}</Card.Title>
                                    <p className='small'>Year: {movie.year}</p>
                                    <Card.Text>{movie.description}</Card.Text>
                                    <Button
                                        className='btn-block btn-danger'
                                        onClick={() => handleDeleteMovie(movie.movieId)}>
                                        Delete this Movie!
                                    </Button>
                                </Card.Body>
                            </Card>
                        );
                    })}
                </CardColumns>
            </Container>
        </>
    );
};






export default SavedMovies;
