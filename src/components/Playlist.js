import React, { useEffect, useState } from "react";
import axios from "axios";
import Album from "./Album";
import { Col, Row } from "react-bootstrap";

const Playlist = () => {
    const CLIENT_ID = "95383cdfac9943cf814a92aefe535ab5";
    const REDIRECT_URI = "https://spinset.netlify.app/"; //https://spinset.netlify.app/ http://localhost:8888/
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const RESPONSE_TYPE = "token";
    const SCOPE =
        "playlist-modify-private playlist-modify-public user-library-modify playlist-modify-public playlist-read-private";
    const [playlist, setPlaylist] = useState([]);
    const [token, setToken] = useState("");
    const [spotifyID, setSpotifyID] = useState("guest");

    useEffect(() => {
        let userID = window.localStorage.getItem("userID")
            ? window.localStorage.getItem("userID")
            : spotifyID;
        axios
            .get(`https://spinset-db.herokuapp.com/albums?userID=${userID}`)
            .then((res) => setPlaylist(res.data));
    }, []);

    //check l'url pour le token spotify et l'extrait dans token
    useEffect(() => {
        const hash = window.location.hash;
        let token = window.localStorage.getItem("token");

        if (!token && hash) {
            token = hash
                .substring(1)
                .split("&")
                .find((elem) => elem.startsWith("access_token"))
                .split("=")[1];

            window.location.hash = "";
            window.localStorage.setItem("token", token);
        }

        setToken(token);
    }, []);

    useEffect(() => {
        axios
            .get(`	https://api.spotify.com/v1/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => setSpotifyID(res.data.id));
        console.log(`spotifyID: ${spotifyID}`);
    }, [token]);

    useEffect(() => {
        window.localStorage.setItem("userID", spotifyID);
    }, [spotifyID]);

    const logout = () => {
        setToken("");
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("userID");
    };

    return (
        <div>
            {!token ? (
                <Row className="text-center mt-3">
                    <Col lg={6}>
                        <h2>
                            Log toi sur ton spotify pour pouvoir te faire une
                            playlist avec ce qu'on ??coute!
                        </h2>
                    </Col>
                    <Col lg={6}>
                        <a
                            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}
                        >
                            <button className="fancy" value="playlist">
                                <span className="top-key"></span>
                                <span className="text">Login Spotify</span>
                                <span className="bottom-key-1"></span>
                                <span className="bottom-key-2"></span>
                            </button>
                        </a>
                    </Col>
                </Row>
            ) : (
                <Row className="text-center mt-3">
                    <Col lg={6}>
                        <h2>Bien logg??!</h2>
                    </Col>
                    <Col lg={6}>
                        <button
                            type="button"
                            className="fancy"
                            value="playlist"
                            onClick={logout}
                        >
                            <span className="top-key"></span>
                            <span className="text">Logout</span>
                            <span className="bottom-key-1"></span>
                            <span className="bottom-key-2"></span>
                        </button>
                    </Col>
                </Row>
            )}
            {playlist.map((album) => (
                <Album
                    id={album.id}
                    basic_information={album}
                    key={album.id}
                    hideAddButton={true}
                    tokenSpotify={token}
                    spotifyID={spotifyID}
                />
            ))}
        </div>
    );
};

export default Playlist;
