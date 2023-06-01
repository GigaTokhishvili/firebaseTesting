import React from "react";

function Image(props) {
    return(
        <div className="imageDiv">
            <img src={props.url} alt="image" />
        </div>
    )
}

export default Image;