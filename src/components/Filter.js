import React, { useEffect, useState } from "react";
import Album from "./Album";

const Filter = (props) => {
    const collection = props;
    const [style, setStyle] = useState("");
    const [albums, setAlbums] = useState([]);
    const [oneAlbum, setOneAlbum] = useState(false);
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
            <label>
                Style:
                <select
                    name="styles"
                    id="styles"
                    value={style}
                    onChange={changeStyle}
                >
                    {stylesArr.map((style) => (
                        <option value={style}>{style}</option>
                    ))}
                </select>
            </label>

            <button onClick={onlyOneAlbum}>Un seul album</button>
            <button onClick={allAlbums}>Tous les albums</button>

            {oneAlbum && (
                <Album {...albums[Math.floor(Math.random() * albums.length)]} />
            )}

            {!oneAlbum && albums.map((album) => <Album {...album} />)}
        </div>
    );
};

export default Filter;
