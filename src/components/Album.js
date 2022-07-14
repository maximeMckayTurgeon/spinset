import axios from "axios";
import React, { useState } from "react";
import { Col, Row, Image } from "react-bootstrap";

const Album = (props) => {
	const { basic_information, hideAddButton, id } = props;
	const [confirmation, setConfirmation] = useState("");
	const [playlistIsLoading, setPlaylistIsLoading] = useState(false);
	const [disableButton, setDisableButton] = useState(false);
	if (!basic_information) {
		return null;
	}

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
	console.log(`id: ${id}`);

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
					<div>{confirmation}</div>
				</Col>
			</Row>
		</div>
	);
};

export default Album;
