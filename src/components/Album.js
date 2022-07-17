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
	const [isOnSpotify, setIsOnSpotify] = useState(false);
	const [disableButtonSpotify, setDisableButtonSpotify] = useState(false);

	console.log(spotifyID);

	//recherche spotify pour le nom d'artiste de l'api discogs
	useEffect(() => {
		if (hideAddButton) {
			let artistName = basic_information.artists[0].name.includes("(")
				? basic_information.artists[0].name
						.slice(0, basic_information.artists[0].name.indexOf("("))
						.trim()
				: basic_information.artists[0].name;
			console.log("enter spotify flow");
			axios
				.get("https://api.spotify.com/v1/search", {
					headers: {
						Authorization: `Bearer ${tokenSpotify}`,
					},
					params: {
						q: artistName,
						type: "artist",
					},
				})
				.then((res) => {
					setSearchResultSpotify(res.data.artists.items);
				});
		}
	}, []);

	useEffect(() => {
		if (hideAddButton) {
			axios
				.get(`	https://api.spotify.com/v1/me/playlists`, {
					headers: {
						Authorization: `Bearer ${tokenSpotify}`,
					},
				})
				.then((res) => {
					let playlists = res.data.items;
					for (let playlist of playlists) {
						if (playlist.name === "Spinset") {
							setPlaylistSpotifyID(playlist.id);
							if (!playlistSpotifyExists) {
								setPlaylistSpotifyExists(true);
							}
							console.log(`get playlist id ${playlist.id}`);
							break;
						}
					}
				});
		}
	}, [playlistSpotifyExists]);

	//Cherche un === nom d'artiste spotify et extrait son ID
	useEffect(() => {
		if (hideAddButton) {
			let artistName = basic_information.artists[0].name.includes("(")
				? basic_information.artists[0].name
						.slice(0, basic_information.artists[0].name.indexOf("("))
						.trim()
				: basic_information.artists[0].name;
			for (let artist of searchResultSpotify) {
				if (artist.name.toLowerCase() === artistName.toLowerCase()) {
					setExactArtistID(artist.id);
					console.log(`1. id d'artiste: ${artist.id}`);
					break;
				}
			}
		}
	}, [searchResultSpotify]);

	//Va chercher la discography de l'ID
	useEffect(() => {
		if (hideAddButton) {
			console.log(`artist id: ${exactArtistID}`);
			axios
				.get(`https://api.spotify.com/v1/artists/${exactArtistID}/albums`, {
					headers: {
						Authorization: `Bearer ${tokenSpotify}`,
					},
				})
				.then((res) => {
					setArtistAlbumsSpotify(res.data.items);
					console.log(`2. Discography de l'ID: ${res.data.items}`);
				});
		}
	}, [exactArtistID]);

	useEffect(() => {
		for (let album of artistAlbumsSpotify) {
			if (album.name.toLowerCase() === basic_information.title.toLowerCase()) {
				setAlbumSpotifyId(album.id);
				setIsOnSpotify(true);
				console.log(`3. album id: ${albumSpotifyId}`);
				break;
			}
		}
	}, [artistAlbumsSpotify]);

	useEffect(() => {
		if (hideAddButton) {
			axios
				.get(`	https://api.spotify.com/v1/albums/${albumSpotifyId}/tracks`, {
					headers: {
						Authorization: `Bearer ${tokenSpotify}`,
					},
				})
				.then((res) => {
					setTracks(res.data.items);
					console.log(`4. tracks: ${res.data.items}`);
				});
		}
	}, [albumSpotifyId]);

	useEffect(() => {
		if (hideAddButton) {
			setTrackIDs(tracks.map((track) => `spotify:track:${track.id}`));
			console.log(`5: tracksIDs: ${tracksIDs}`);
		}
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
						description: "Tsé là ce qu'on écoutait chez max...",
					},

					{
						headers: {
							Authorization: `Bearer ${tokenSpotify}`,
						},
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
		console.log(tracksIDs);
		console.log(`uris: ${tracksIDs}`);
		axios
			.post(
				`https://api.spotify.com/v1/playlists/${playlistSpotifyID}/tracks`,
				{ uris: tracksIDs },
				{
					headers: {
						Authorization: `Bearer ${tokenSpotify}`,
					},
				}
			)
			.then(() => {
				setConfirmation("Album ajouté à ton spotify!");
				setDisableButtonSpotify(true);
			});
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
		axios.delete(`https://spinset-db.herokuapp.com/albums/${id}`).then(() => {
			setConfirmation("C'est deleté!");
			setPlaylistIsLoading(false);
			setDisableButton(true);
		});
	};

	if (!basic_information || (hideAddButton && !tracksIDs)) {
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
					<h1 className="mt-3 mt-lg-0">{basic_information.artists[0].name}</h1>
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
					{hideAddButton && playlistSpotifyExists && isOnSpotify && (
						<button
							type="button"
							className="fancy mt-3"
							onClick={addAlbumTracks}
							disabled={disableButtonSpotify}
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
					)}
					{!playlistSpotifyExists && hideAddButton && (
						<button
							type="button"
							className="fancy mt-3"
							onClick={createSpotifyPlaylist}
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
									'Créer une playlist spotify "spinset"'
								)}
							</span>
							<span className="bottom-key-1"></span>
							<span className="bottom-key-2"></span>
						</button>
					)}

					<h2>{confirmation}</h2>
				</Col>
			</Row>
		</div>
	);
};

export default Album;
