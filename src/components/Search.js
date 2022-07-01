import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Album from "./Album";

const Search = (props) => {
    const collection = props;
    const [search, setSearch] = useState("");
    const [param, setParam] = useState("band");
    const [tempResult, setTempResult] = useState("");
    const [result, setResult] = useState([]);
    const [noResult, setNoResult] = useState("");

    const changeSearch = (e) => {
        setSearch(e.target.value);
    };

    const changeParam = (e) => {
        setParam(e.target.value);
        setSearch("");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            launchSearch();
            if (result.length === 0) {
                setNoResult("J'en ai pas de tsa!");
            }
        }
    };

    useEffect(() => {
        let filteredAlbums = Object.values(collection).filter((album) =>
            param === "band"
                ? album.basic_information.artists[0].name
                      .toLowerCase()
                      .includes(search.toLowerCase())
                : album.basic_information.title
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
                <Row className="justify-content-center align-items-center mt-5">
                    <Col lg={6} className="text-center">
                        <input
                            type="text"
                            value={search}
                            placeholder=".  .  ."
                            onChange={changeSearch}
                            onKeyDown={handleKeyPress}
                            className="inputText"
                        ></input>

                        <button
                            type="button"
                            className="fancy mt-3"
                            onClick={launchSearch}
                        >
                            <span className="top-key"></span>
                            <span className="text">Rechercher</span>
                            <span className="bottom-key-1"></span>
                            <span className="bottom-key-2"></span>
                        </button>
                    </Col>

                    <Col
                        lg={3}
                        className="text-center d-flex justify-content-center my-2"
                    >
                        <label>
                            <input
                                type="radio"
                                checked={param === "band"}
                                value="band"
                                onChange={changeParam}
                            ></input>
                            <span className="checkmark"></span>
                            Par Band
                        </label>
                        <label>
                            <input
                                type="radio"
                                checked={param === "album"}
                                value="album"
                                onChange={changeParam}
                            ></input>
                            <span className="checkmark"></span>
                            Par Album
                        </label>
                    </Col>
                </Row>
            </form>

            {result.length >= 1 && <h2>{result.length} albums!</h2>}

            {result.length >= 1 ? (
                result.map((album) => <Album {...album} key={album.id} />)
            ) : (
                <div>{noResult}</div>
            )}
        </div>
    );
};

export default Search;
