import axios from "axios";
import React, { useEffect, useState } from "react";
import Album from "./Album";

const Random = (props) => {
    const [randomAlbum, setRandomAlbum] = useState({});
    const [newAlbum, setNewAlbum] = useState(true);
    useEffect(() => {
        let randomIndex = Math.floor(
            Math.random() * Object.values(props).length
        );
        setRandomAlbum(props[randomIndex]);
    }, [newAlbum, props]);

    const getNewAlbum = () => {
        newAlbum ? setNewAlbum(false) : setNewAlbum(true);
    };

    return (
        <div className="random">
            <Album {...randomAlbum} key={randomAlbum.id} />
            <button className="fancy" value="random" onClick={getNewAlbum}>
                <span className="top-key"></span>
                <span className="text">Pas ca!</span>
                <span className="bottom-key-1"></span>
                <span className="bottom-key-2"></span>
            </button>
        </div>
    );
};

export default Random;
