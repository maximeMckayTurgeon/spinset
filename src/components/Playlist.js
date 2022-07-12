import React, { useEffect, useState } from "react";
import axios from "axios";
import Album from "./Album";

const Playlist = () => {
    const [playlist, setPlaylist] = useState([]);

    useEffect(() => {
        axios
            .get("https://spinset-db.herokuapp.com/albums")
            .then((res) => setPlaylist(res.data));
    }, []);

    console.log(playlist);

    return (
        <div>
            {playlist.map((album) => (
                <Album
                    id={album.id}
                    basic_information={album}
                    key={album.id}
                    hideAddButton={true}
                />
            ))}
        </div>
    );
};

export default Playlist;
