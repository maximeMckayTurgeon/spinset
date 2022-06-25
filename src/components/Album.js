import React from "react";

const Album = (props) => {
    const { basic_information } = props;
    if (!basic_information) {
        return null;
    }

    return (
        <div className="album">
            <img src={basic_information.cover_image} alt="pochette"></img>
            <div>
                <h1>{basic_information.artists[0].name}</h1>
                <h2>{basic_information.title}</h2>
            </div>
        </div>
    );
};

export default Album;
