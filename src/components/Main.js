require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

let yeomanImage = require('../images/yeoman.png')

//获取图片相关信息数据
var imageDatas = require('../data/imgdata.json');

// 图片信息转url
var imageData = (function genImageURL(imageDataArr) {
    for (var i = 0, j = imageDataArr.length; i < j; i++) {
        var singleImageData = imageDataArr[i];

        singleImageData.imageURL = require('../images/' + singleImageData.fileName);

        imageDataArr[i] = singleImageData;
    }
    return imageDataArr;
})(imageDatas);

class AppComponent extends React.Component {
    render() {
        return (
            <div className="index">
                <h2>Hello world</h2>
                <img src={yeomanImage} alt="Yeoman Generator"/>
                <div className="notice">Please edit
                    <code>src/components/Main.js</code>
                    to get started!</div>
                <section className="stage">
                    <section className="img-sec"></section>
                    <nav className="controller-nav"></nav>
                </section>
            </div>
        );
    }
}

AppComponent.defaultProps = {};

export default AppComponent;
