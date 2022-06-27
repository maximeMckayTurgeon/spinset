import axios from "axios";
import React, { useEffect, useState } from "react";

const Album = (props) => {
  const { basic_information, tracklist } = props;
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

        {basic_information &&
          basic_information.styles.map((style) => <h4>{style}</h4>)}
      </div>
      <div>
        <ol>{tracklist && tracklist.map((track) => <li>{track.title}</li>)}</ol>
      </div>
    </div>
  );
};

export default Album;
