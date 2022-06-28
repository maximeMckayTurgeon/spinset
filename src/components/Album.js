import React from "react";

const Album = (props) => {
    const { basic_information } = props;
    console.log(props);
    if (!basic_information) {
        return null;
    }

    return (
        <div className="album">
            <img src={basic_information.cover_image} alt="pochette"></img>
            <div>
                <h1>{basic_information.artists[0].name}</h1>
                <h2>{basic_information.title}</h2>
                <h3>{basic_information.year}</h3>
                <div>
                    {basic_information &&
                        basic_information.styles.map((style) => (
                            <span className="style">{style}</span>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Album;
