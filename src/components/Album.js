import React from "react";
import { Col, Row, Image } from "react-bootstrap";

const Album = (props) => {
    const { basic_information } = props;
    console.log(props);
    if (!basic_information) {
        return null;
    }

    return (
        <div className="album">
            <Row className="justify-content-center my-3 p-3 shadow-lg rounded">
                <Col lg={6}>
                    <Image
                        fluid
                        src={basic_information.cover_image}
                        alt="pochette"
                    ></Image>
                </Col>
                <Col lg={6} className="">
                    <h1 className="mt-3 mt-lg-0">
                        {basic_information.artists[0].name}
                    </h1>
                    <h2>{basic_information.title}</h2>
                    <h3>{basic_information.year}</h3>
                    <div>
                        {basic_information &&
                            basic_information.styles.map((style) => (
                                <span className="style">{style}</span>
                            ))}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Album;
