// //test layout to get working

import React, { useState, useEffect } from "react"; //add useEffect
import {
  Jumbotron,
  Container,
  Col,
  Form,
  Button,
  Card,
  CardColumns,
} from "react-bootstrap";
import Image from "../images/p3-background.png";

import { saveMovieIds, getSavedMovieIds } from "../utils/localStorage";
import { saveMovie } from "../utils/API";

import Auth from "../utils/auth";

const SearchMovies = () => {
  // create state for holding returned api data
  const [searchedMovies, setSearchedMovies] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");

  // // create state to hold saved movieID values
  const [savedMovieIds, setSavedMovieIds] = useState(getSavedMovieIds());

  // const [saveMovie, { error }] = useMutation(SAVE_MOVIE);

  // set up useEffect hook to save `savedMovieIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveMovieIds(savedMovieIds);
  });

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await fetch(
        `http://www.omdbapi.com/?s=${searchInput}&apikey=a9e94ec0`
      );

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const { Search } = await response.json();

      const movieData = Search.map((movie) => ({
        title: movie.Title,
        poster: movie.Poster,
        // plot: movie.Plot
      }));

      setSearchedMovies(movieData);
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };

  // // create function to handle saving a book to our database
  const handleSaveMovie = async (movieId) => {
    // //   // find the book in `searchedBooks` state by the matching id
    const movieToSave = searchedMovies.find(
      (movie) => movie.movieId === movieId
    );

    //   // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await saveMovie(movieToSave, token);
      if (!response) {
        throw new Error("something went wrong!");
      }
      //const { data } = await saveMovie({
      //  variables: { movieData: { ...movieToSave } },
      //});
      //console.log(savedMovieIds);
      setSavedMovieIds([...savedMovieIds, movieToSave.movieId]);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <Jumbotron
        fluid
        block
        style={{ backgroundImage: `url(${Image})`, height: "340px" }}
      >
        <Container>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a movie"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button
                  type="submit"
                  block
                  style={{
                    backgroundColor: "#1ACDC8",
                    color: "#FEFEFE",
                    fontWeight: "bold",
                  }}
                  size="lg"
                >
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedMovies.length
            ? `Viewing ${searchedMovies.length} results:`
            : ""}
        </h2>
        <CardColumns>
          {searchedMovies.map((movie) => {
            return (
              <Card key={movie.movieId} border="dark">
                {movie.poster ? (
                  <Card.Img
                    src={movie.poster}
                    alt={`The cover for ${movie.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>
                  {/* <p className='small'>Plot: {movie.Plot}</p> */}
                  {/* <Card.Text>{movie.Plot}</Card.Text> */}
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedMovieIds?.some(
                        (savedId) => savedId === movie.movieId
                      )}
                      className="btn-block btn-info"
                      onClick={() => handleSaveMovie(movie.movieId)}
                    >
                      {savedMovieIds?.some(
                        (savedId) => savedId === movie.movieId
                      )
                        ? "Movie already added to watchlist!"
                        : "Add to watchlist!"}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SearchMovies;
