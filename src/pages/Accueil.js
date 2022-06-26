import axios from "axios";
import React, { useEffect, useState } from "react";
import Filter from "../components/Filter";
import Random from "../components/Random";

const Accueil = () => {
    const [isLoading, setLoading] = useState(true);
    const [collection, setCollection] = useState([]);
    const [pages, setPages] = useState(1);
    useEffect(() => {
        axios
            .get(
                "https://api.discogs.com//users/Ghostreverie91/collection/folders/01/releases?token=jPYuYaFXJhZHhrhwPMWgqtYOCuzYtxepVPChejDO&per_page=100"
            )
            .then((res) => {
                setCollection(res.data.releases);
                setPages(res.data.pagination.pages);
            });
    }, []);

    useEffect(() => {
        for (let i = 2; i <= pages; i++) {
            axios
                .get(
                    `https://api.discogs.com//users/Ghostreverie91/collection/folders/01/releases?token=jPYuYaFXJhZHhrhwPMWgqtYOCuzYtxepVPChejDO&per_page=100&page=${i}`
                )
                .then((res) => {
                    setCollection([...collection, ...res.data.releases]);
                    if (i === pages) {
                        setLoading(false);
                    }
                });
        }
    }, [pages]);

    if (isLoading) {
        return <div>Ca s'en vient...</div>;
    }

    return (
        <>
            <Random {...collection} />
            <Filter {...collection} />
        </>
    );
};

export default Accueil;
