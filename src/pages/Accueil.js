import axios from "axios";
import React, { useEffect, useState } from "react";
import Random from "../components/Random";

const Accueil = () => {
    const [isLoading, setLoading] = useState(true);
    const [collection, setCollection] = useState([]);
    useEffect(() => {
        axios
            .get(
                "https://api.discogs.com//users/Ghostreverie91/collection/folders/01/releases?token=jPYuYaFXJhZHhrhwPMWgqtYOCuzYtxepVPChejDO&per_page=100"
            )
            .then((res) => {
                setCollection(res.data.releases);
                setLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <Random {...collection} />;
};

export default Accueil;
