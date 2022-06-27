import axios from "axios";
import React, { useEffect, useState } from "react";
import Album from "./Album";

const Random = (props) => {
  const [randomAlbum, setRandomAlbum] = useState({});
  const [randomResources, setRandomResources] = useState({});
  const [randomTracklist, setRandomTracklist] = useState([]);
  const [newAlbum, setNewAlbum] = useState(true);
  useEffect(() => {
    let randomIndex = Math.floor(Math.random() * 100);
    setRandomAlbum(props[randomIndex]);
    setRandomResources(props[randomIndex].basic_information.resource_url);
  }, [newAlbum, props]);

  useEffect(() => {
    axios
      .get(randomResources)
      .then((res) => setRandomTracklist(res.data.tracklist));
  }, [randomResources]);

  const getNewAlbum = () => {
    newAlbum ? setNewAlbum(false) : setNewAlbum(true);
  };
  console.log(randomAlbum);

  return (
    <div className="random">
      <Album {...randomAlbum} tracklist={randomTracklist} />
      <button onClick={getNewAlbum}>Pas ça!</button>
    </div>
  );
};

export default Random;
