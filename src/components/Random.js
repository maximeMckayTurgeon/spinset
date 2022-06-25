import React, { useEffect, useState } from "react";
import Album from "./Album";

const Random = (props) => {
    const [randomAlbum, setRandomAlbum] = useState({});
    const [newAlbum, setNewAlbum] = useState(true);
    useEffect(() => {
        let randomIndex = Math.floor(Math.random() * 100);
        setRandomAlbum(props[randomIndex]);
    }, [newAlbum]);

    const getNewAlbum = () => {
        newAlbum ? setNewAlbum(false) : setNewAlbum(true);
    };

    return (
        <div className="random">
            <Album {...randomAlbum} />
            <button onClick={getNewAlbum}>Album aleatoire</button>
        </div>
    );
};

export default Random;
