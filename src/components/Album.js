import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Row, Image } from "react-bootstrap";

const Album = (props) => {
    const { basic_information, hideAddButton, tokenSpotify, id, spotifyID } =
        props;
    const [confirmation, setConfirmation] = useState("");
    const [playlistIsLoading, setPlaylistIsLoading] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    //spotify
    const [searchResultSpotify, setSearchResultSpotify] = useState([]);
    const [exactArtistID, setExactArtistID] = useState("");
    const [artistAlbumsSpotify, setArtistAlbumsSpotify] = useState([]);
    const [albumSpotifyId, setAlbumSpotifyId] = useState("");
    const [tracks, setTracks] = useState([]);
    const [tracksIDs, setTrackIDs] = useState([]);
    const [playlistSpotifyExists, setPlaylistSpotifyExists] = useState(false);
    const [playlistSpotifyID, setPlaylistSpotifyID] = useState("");
    const [addTracks, setAddTracks] = useState(false);

    let tracksArr = [];
    console.log(spotifyID);

    //recherche spotify pour le nom d'artiste de l'api discogs
    useEffect(() => {
        if (tokenSpotify) {
            axios
                .get("https://api.spotify.com/v1/search", {
                    headers: {
                        Authorization: `Bearer ${tokenSpotify}`
                    },
                    params: {
                        q: basic_information.artists[0].name,
                        type: "artist"
                    }
                })
                .then((res) => {
                    setSearchResultSpotify(res.data.artists.items);
                });
        }
    }, []);

    useEffect(() => {
        if (tokenSpotify) {
            axios
                .get(`	https://api.spotify.com/v1/me/playlists`, {
                    headers: {
                        Authorization: `Bearer ${tokenSpotify}`
                    }
                })
                .then((res) => {
                    let playlists = res.data.items;
                    for (let playlist of playlists) {
                        if (playlist.name == "Spinset") {
                            setPlaylistSpotifyID(playlist.id);
							
                            console.log(`get playlist id ${playlist.id}`);
                            break;
                        }
                    }
                });
        }
    }, []);

    //Cherche un === nom d'artiste spotify et extrait son ID
    useEffect(() => {
        for (let artist of searchResultSpotify) {
            if (artist.name === basic_information.artists[0].name) {
                setExactArtistID(artist.id);
                break;
            }
        }
    }, [searchResultSpotify]);

    //Va chercher la discography de l'ID
    useEffect(() => {
        console.log(`artist id: ${exactArtistID}`);
        axios
            .get(`https://api.spotify.com/v1/artists/${exactArtistID}/albums`, {
                headers: {
                    Authorization: `Bearer ${tokenSpotify}`
                }
            })
            .then((res) => {
                setArtistAlbumsSpotify(res.data.items);
            });
    }, [exactArtistID]);

    useEffect(() => {
        for (let album of artistAlbumsSpotify) {
            if (album.name == basic_information.title) {
                setAlbumSpotifyId(album.id);
                console.log(`album id: ${albumSpotifyId}`);
                break;
            }
        }
    }, [artistAlbumsSpotify]);

    useEffect(() => {
        console.log(albumSpotifyId);
        axios
            .get(`	https://api.spotify.com/v1/albums/${albumSpotifyId}/tracks`, {
                headers: {
                    Authorization: `Bearer ${tokenSpotify}`
                }
            })
            .then((res) => {
                setTracks(res.data.items);
            });
    }, [albumSpotifyId]);

    useEffect(() => {
        setTrackIDs(tracks.map((track) => `spotify:track:${track.id}`));
    }, [tracks]);

    // useEffect(() => {
    // 	createSpotifyPlaylist();
    // }, [addTracks]);

    const createSpotifyPlaylist = () => {
        if (!playlistSpotifyExists) {
            axios
                .post(
                    `https://api.spotify.com/v1/users/${spotifyID}/playlists`,
                    {
                        name: "Spinset",
                        public: true,
                        description: "Tsé là ce qu'on écoutait chez max..."
                    },

                    {
                        headers: {
                            Authorization: `Bearer ${tokenSpotify}`
                        }
                    }
                )
                .then(() => {
                    setPlaylistSpotifyExists(true);
                });
        } else {
            setPlaylistSpotifyExists(true);
        }
    };

    const addAlbumTracks = () => {
        console.log(`uris: ${tracksIDs}`);
        axios.post(
            `https://api.spotify.com/v1/playlists/${playlistSpotifyID}/tracks`,
            { uris: tracksIDs },
            {
                headers: {
                    Authorization: `Bearer ${tokenSpotify}`
                }
            }
        );
    };

    const addToPlaylist = (e) => {
        setPlaylistIsLoading(true);
        axios
            .post("https://spinset-db.herokuapp.com/albums", basic_information)
            .then(() => {
                setConfirmation("C'est ajouté!");
                setPlaylistIsLoading(false);
                setDisableButton(true);
            });
    };

    const deleteFromPlaylist = () => {
        setPlaylistIsLoading(true);
        axios
            .delete(`https://spinset-db.herokuapp.com/albums/${id}`)
            .then(() => {
                setConfirmation("C'est deleté!");
                setPlaylistIsLoading(false);
                setDisableButton(true);
            });
    };

    if (!basic_information) {
        return null;
    }

    return (
        <div className="album">
            <Row className="justify-content-center my-3 p-3 shadow-lg rounded">
                <Col lg={6}>
                    <Image
                        fluid
                        src={basic_information.cover_image}
                        alt="pochette"
                    ></Image>
                </Col>
                <Col lg={6} className="">
                    <h1 className="mt-3 mt-lg-0">
                        {basic_information.artists[0].name}
                    </h1>
                    <h2>{basic_information.title}</h2>
                    <h3>{basic_information.year}</h3>
                    <div>
                        {basic_information &&
                            basic_information.styles.map((style) => (
                                <span className="style">{style}</span>
                            ))}
                    </div>
                    {!hideAddButton && (
                        <button
                            type="button"
                            className="fancy mt-3"
                            onClick={addToPlaylist}
                            disabled={disableButton}
                        >
                            <span className="top-key"></span>
                            <span className="text">
                                {playlistIsLoading ? (
                                    <div className="loading">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                ) : (
                                    "Ajouter à la Playlist"
                                )}
                            </span>
                            <span className="bottom-key-1"></span>
                            <span className="bottom-key-2"></span>
                        </button>
                    )}
                    {hideAddButton && (
                        <button
                            type="button"
                            className="fancy mt-3"
                            onClick={deleteFromPlaylist}
                            disabled={disableButton}
                        >
                            <span className="top-key"></span>
                            <span className="text">
                                {" "}
                                {playlistIsLoading ? (
                                    <div className="loading">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                ) : (
                                    "Deleter de la Playlist"
                                )}
                            </span>
                            <span className="bottom-key-1"></span>
                            <span className="bottom-key-2"></span>
                        </button>
                    )}
                    {tokenSpotify && (
                        <>
                            <button
                                type="button"
                                className="fancy mt-3"
                                onClick={addAlbumTracks}
                                // disabled={disableButton}
                            >
                                <span className="top-key"></span>
                                <span className="text">
                                    {" "}
                                    {playlistIsLoading ? (
                                        <div className="loading">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    ) : (
                                        "Ajouter à ton Spotify"
                                    )}
                                </span>
                                <span className="bottom-key-1"></span>
                                <span className="bottom-key-2"></span>
                            </button>
                            <button
                                type="button"
                                className="fancy mt-3"
                                onClick={createSpotifyPlaylist}
                                // disabled={disableButton}
                            >
                                <span className="top-key"></span>
                                <span className="text">
                                    {" "}
                                    {playlistIsLoading ? (
                                        <div className="loading">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    ) : (
                                        "Créer une playlist spotify \"spinset\""
                                    )}
                                </span>
                                <span className="bottom-key-1"></span>
                                <span className="bottom-key-2"></span>
                            </button>
                        </>
                    )}
                    <div>{confirmation}</div>
                </Col>
            </Row>
        </div>
    );
};

export default Album;
