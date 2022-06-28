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
    console.log(randomAlbum);

    return (
        <div className="random">
            <Album {...randomAlbum} />
            <button onClick={getNewAlbum}>Pas ça!</button>
        </div>
    );
};

export default Random;
