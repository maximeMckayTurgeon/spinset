import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Filter from "../components/Filter";
import Random from "../components/Random";
import Search from "../components/Search";
import { Col, Container, Row } from "react-bootstrap";

const Accueil = () => {
    const [isLoading, setLoading] = useState(true);
    const [collection, setCollection] = useState([]);
    const [pages, setPages] = useState(1);
    const [module, setModule] = useState("");
    const [nbrAlbums, setNbrAlbums] = useState(0);
    useEffect(() => {
        axios.get(`/.netlify/functions/discogs?page=1`).then((res) => {
            setPages(res.data.pagination.pages);
            setNbrAlbums(res.data.pagination.items);
        });
    }, []);

    useEffect(() => {
        let promiseArr = [];
        let resultArr = [];
        for (let i = 1; i <= pages; i++) {
            promiseArr.push(axios.get(`/.netlify/functions/discogs?page=${i}`));
        }
        Promise.all(promiseArr)
            .then((reses) => {
                for (let res of reses) {
                    resultArr.push(...res.data.releases);
                }
            })
            .finally(() => {
                setCollection([...resultArr]);
                setLoading(false);
            });
    }, [pages]);

    const chooseModule = (e) => {
        e.target.value
            ? setModule(e.target.value)
            : setModule(e.target.parentElement.value);
        console.log(e.target.value);
    };

    if (isLoading) {
        return (
            <div className="loading">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        );
    }

    return (
        <Container>
            <div className="accueil">
                <h1 className="text-center mb-5">{`${nbrAlbums} Albums en stock!`}</h1>
                <Row className="justify-content-center">
                    <Col className="text-center my-2">
                        <button
                            className="fancy"
                            value="random"
                            onClick={chooseModule}
                        >
                            <span className="top-key"></span>
                            <span className="text">Random</span>
                            <span className="bottom-key-1"></span>
                            <span className="bottom-key-2"></span>
                        </button>
                    </Col>
                    <Col className="text-center my-2">
                        <button
                            className="fancy"
                            value="filter"
                            onClick={chooseModule}
                        >
                            <span className="top-key"></span>
                            <span className="text">Genre</span>
                            <span className="bottom-key-1"></span>
                            <span className="bottom-key-2"></span>
                        </button>
                    </Col>
                    <Col className="text-center my-2">
                        <button
                            className="fancy"
                            value="search"
                            onClick={chooseModule}
                        >
                            <span className="top-key"></span>
                            <span className="text">Recherche</span>
                            <span className="bottom-key-1"></span>
                            <span className="bottom-key-2"></span>
                        </button>
                    </Col>
                </Row>
                {{
                    random: <Random {...collection} />,
                    filter: <Filter {...collection} />,
                    search: <Search {...collection} />
                }[module] || <div>Choisi de quoi!</div>}
            </div>
        </Container>
    );
};

export default Accueil;
