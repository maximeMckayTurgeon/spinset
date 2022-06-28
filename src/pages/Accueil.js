import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Filter from "../components/Filter";
import Random from "../components/Random";
import Search from "../components/Search";

const Accueil = () => {
    const [isLoading, setLoading] = useState(true);
    const [collection, setCollection] = useState([]);
    const [pages, setPages] = useState(1);
    const [module, setModule] = useState("");
    const [nbrAlbums, setNbrAlbums] = useState(0);
    useEffect(() => {
        axios.get(`/.netlify/functions/discogs?page=1`).then((res) => {
            // setCollection(res.data.releases);
            setPages(res.data.pagination.pages);
            setNbrAlbums(res.data.pagination.items);
        });
    }, []);

    useEffect(() => {
        for (let i = 1; i <= pages; i++) {
            axios.get(`/.netlify/functions/discogs?page=${i}`).then((res) => {
                setCollection([...collection, ...res.data.releases]);
                if (i === pages) {
                    setLoading(false);
                }
            });
        }
    }, [pages]);

    const chooseModule = (e) => {
        setModule(e.target.value);
    };

    if (isLoading) {
        return <div>Ca s'en vient...</div>;
    }

    return (
        <div className="accueil">
            <h1>{`${nbrAlbums} Albums en stock!`}</h1>
            <div className="buttonDiv">
                <button
                    className="buttonModule"
                    type="button"
                    value="random"
                    onClick={chooseModule}
                >
                    Random
                </button>
                <button
                    className="buttonModule"
                    type="button"
                    value="filter"
                    onClick={chooseModule}
                >
                    Par genre
                </button>
                <button
                    className="buttonModule"
                    type="button"
                    value="search"
                    onClick={chooseModule}
                >
                    Recherche par artiste
                </button>
            </div>
            {{
                random: <Random {...collection} />,
                filter: <Filter {...collection} />,
                search: <Search {...collection} />
            }[module] || <div>Choisi de quoi!</div>}
        </div>
    );
};

export default Accueil;
