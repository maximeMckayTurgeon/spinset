import React, { useEffect, useState } from "react";
import Album from "./Album";
import { Row, Col } from "react-bootstrap";

const Filter = (props) => {
    const collection = props;
    const [style, setStyle] = useState("");
    const [albums, setAlbums] = useState([]);
    const [oneAlbum, setOneAlbum] = useState(false);
    const tousLesAlbums = document.getElementById("tousLesAlbums");
    const albumRandom = document.getElementById("albumRandom");
    let stylesArr = [];
    for (let i = 0; i < Object.values(collection).length; i++) {
        let styles = collection[i].basic_information.styles;
        for (let individualStyle of styles) {
            if (!stylesArr.includes(individualStyle)) {
                stylesArr.push(individualStyle);
            }
        }
    }
    stylesArr.sort();

    const changeStyle = (e) => {
        setStyle(e.target.value);
        oneAlbum ? albumRandom.focus() : tousLesAlbums.focus();
    };

    const onlyOneAlbum = () => {
        setOneAlbum(true);
    };

    const allAlbums = () => {
        setOneAlbum(false);
    };

    useEffect(() => {
        let filteredAlbums = Object.values(collection).filter((album) =>
            album.basic_information.styles.includes(style)
        );
        setAlbums(filteredAlbums);
    }, [style]);

    return (
        <div className="filter">
            <Row className="top justify-content-around">
                <Col lg={4} className="text-center my-2">
                    <select
                        name="styles"
                        id="styles"
                        value={style}
                        onChange={changeStyle}
                    >
                        <option value="" disabled selected>
                            Choisir un genre
                        </option>
                        {stylesArr.map((style) => (
                            <option value={style}>{style}</option>
                        ))}
                    </select>
                </Col>
                <Col xs={6} lg={4} className="text-center my-2">
                    <button
                        id="albumRandom"
                        className="fancy"
                        onClick={onlyOneAlbum}
                    >
                        <span className="top-key"></span>
                        <span className="text">Un</span>
                        <span className="bottom-key-1"></span>
                        <span className="bottom-key-2"></span>
                    </button>
                </Col>
                <Col xs={6} lg={4} className="text-center my-2">
                    <button
                        id="tousLesAlbums"
                        className="fancy"
                        onClick={allAlbums}
                    >
                        <span className="top-key"></span>
                        <span className="text">Tous</span>
                        <span className="bottom-key-1"></span>
                        <span className="bottom-key-2"></span>
                    </button>
                </Col>
            </Row>

            {oneAlbum ? (
                <Album {...albums[Math.floor(Math.random() * albums.length)]} />
            ) : (
                albums.map((album) => <Album {...album} key={album.id} />)
            )}
        </div>
    );
};

export default Filter;
