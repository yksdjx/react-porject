require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

//获取图片相关信息数据
var imageDatas = require('../data/imgdata.json');

// 图片信息转url
var imageDtatas = (function genImageURL(imageDataArr) {
    for (var i = 0, j = imageDataArr.length; i < j; i++) {
        var singleImageData = imageDataArr[i];

        singleImageData.imageURL = require('../images/' + singleImageData.fileName);

        imageDataArr[i] = singleImageData;
    }
    return imageDataArr;
})(imageDatas);
//获取区间随机值
function getRangeRandom(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

class ImgFigure extends React.Component {

    render() {
        var styleObj = {};

        // 如果props属性中指定了这张图片 的位置，则使用
        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos
        }

        return (
            <figure className="img-figure" style={styleObj}>
                <img src={this.props.data.imageURL} alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-tlt">{this.props.data.title}</h2>
                </figcaption>
            </figure>

        )
    }
}

class AppComponent extends React.Component {
    constructor(props) {
        super(props);
        this.Constant = {
            centerPos: {
                left: 0,
                right: 0
            },
            hPosRange: {
                leftSecX: [
                    0, 0
                ],
                rightSecX: [
                    0, 0
                ],
                y: [0, 0]
            },
            vPosRange: {
                x: [
                    0, 0
                ],
                topY: [0, 0]
            }
        }
    }
    state = {
        imgsArrangeArr: [
            // {
            //     pos: {
            //         left: '0',
            //         top: '0'
            //     }
            // }
        ]
    }
    /*
    * 重新布局说有图片
    * @param centerIndex 指定居中排布哪个图片
    */
    rearrange(centerIndex) {
      console.log(this.state)
        var imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeTopY = vPosRange.TopY,
            vPosRangeX = vPosRange.x,

            imgsArrangeTopArr = [],
            topImgNum = Math.floor(Math.random() * 2), //取一个 或 不取
            topImgSpliceIndex = 0,

            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

        //首先居中 centerIndex 的图片
        imgsArrangeCenterArr[0] = {
            pos: centerPos
        }

        //取出要布局上侧的图片状态信息
        topImgSpliceIndex = Math.ceil(Math.random(imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        //布局上侧的图片
        imgsArrangeTopArr.map(function(value, index) {
            imgsArrangeTopArr[index] = {
                pos: {
                    top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                    left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                }

            };
        });

        //布局左右两侧的图片
        for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
            var hPosRangeLORX = null;
            //前半部分布局左边，后半部分布局右边
            if (i < k) {
                hPosRangeLORX = hPosRangeLeftSecX;
            } else {
                hPosRangeLORX = hPosRangeRightSecX;
            }

            imgsArrangeArr[i] = {
                pos: {
                    top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                    left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                }
            }
        }

        if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        this.setState({imgsArrangeArr: imgsArrangeArr});
    }
    center(index) {
        return function() {
            this.rearrange(index);
        }.bind(this);
    }
    //图片加载后，为每张图片计算其位置范围
    ComponentDidMount() {
        //舞台大小
        let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);

        //拿到一个imageFigure的大小
        let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2);

        //计算中心图片的位置点
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        };

        //左右侧图片区域排布取值
        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;

        //上侧图片区域排布取值
        this.Constant.vPosRange.topY[0] = -halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW;

        var num = Math.floor(Math.random() * 6)

        this.rearrange(num);
    }
    render() {
        var controllerUnits = [],
            imgFigures = [],
            _self = this;
        imageDtatas.map(function(value, index) {
            if (!_self.state.imgsArrangeArr[index]) {
                _self.state.imgsArrangeArr[index] = {
                    pos: {
                        left: '0',
                        top: '0'
                    }
                }
            }
            imgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index} arrange={_self.state.imgsArrangeArr[index]} key={index}/>);
        });

        return (
            <section className="stage" ref="stage">
                <section className="img-sec">
                    {imgFigures}
                </section>
                <nav className="controller-nav">
                    {controllerUnits}
                </nav>
            </section>
        );
    }
}

AppComponent.defaultProps = {};

export default AppComponent;
