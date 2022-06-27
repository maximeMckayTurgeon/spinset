import axios from "axios";
import React, { useEffect, useState } from "react";

const Album = (props) => {
  const { basic_information } = props;
  console.log(props.basic_information.resource_url);
  const [tracklist, setTracklist] = useState({});

  useEffect(() => {
    axios
      .get(basic_information.resource_url)
      .then((res) => setTracklist(res.data.tracklist));
  }, [basic_information]);
  if (!basic_information) {
    return null;
  }

  return (
    <div className="album">
      <img src={basic_information.cover_image} alt="pochette"></img>
      <div>
        <h1>{basic_information.artists[0].name}</h1>
        <h2>{basic_information.title}</h2>

        {basic_information.styles.map((style) => (
          <h4>{style}</h4>
        ))}
      </div>
      <div>
        <ol>
          {tracklist.map((track) => (
            <li>{track.title}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Album;
