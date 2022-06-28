import React, { useEffect, useState } from "react";
import Album from "./Album";

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
            <div className="top">
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

                <button id="albumRandom" onClick={onlyOneAlbum}>
                    Album random
                </button>
                <button id="tousLesAlbums" onClick={allAlbums} autoFocus>
                    Tous les albums
                </button>
            </div>

            {oneAlbum && (
                <Album {...albums[Math.floor(Math.random() * albums.length)]} />
            )}

            {!oneAlbum && albums.map((album) => <Album {...album} />)}
        </div>
    );
};

export default Filter;
