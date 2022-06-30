import React, { useEffect, useState } from "react";
import Album from "./Album";

const Search = (props) => {
    const collection = props;
    const [search, setSearch] = useState("");
    const [param, setParam] = useState("");
    const [tempResult, setTempResult] = useState([]);
    const [result, setResult] = useState([]);

    const changeSearch = (e) => {
        setSearch(e.target.value);
    };

    const changeParam = (e) => {
        setParam(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            launchSearch();
        }
    };

    useEffect(() => {
        let filteredAlbums = Object.values(collection).filter((album) =>
            album.basic_information.artists[0].name
                .toLowerCase()
                .includes(search.toLowerCase())
        );
        setTempResult(filteredAlbums);
    }, [search]);

    const launchSearch = () => {
        setResult(tempResult);
    };
    return (
        <div className="search">
            <form>
                <input
                    type="text"
                    value={search}
                    placeholder="Rechercher"
                    onChange={changeSearch}
                    onKeyDown={handleKeyPress}
                ></input>

                <button type="button" className="fancy" onClick={launchSearch}>
                    <span className="top-key"></span>
                    <span className="text">Rechercher</span>
                    <span className="bottom-key-1"></span>
                    <span className="bottom-key-2"></span>
                </button>

                <label>
                    <input
                        type="radio"
                        checked={param === "name"}
                        value="name"
                        onChange={changeParam}
                    ></input>
                    Par Band
                </label>
            </form>
            {result.map((album) => (
                <Album {...album} />
            ))}
        </div>
    );
};

export default Search;
