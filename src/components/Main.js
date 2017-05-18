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
    return Math.ceil(Math.random() * (high - low) + low);
}
//图片旋转角度±30°
function get30DegRandom() {
    return (Math.random() > 0.5
        ? ''
        : '-') + Math.ceil(Math.random() * 30);
}
class ImgFigure extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e) {

        if (this.props.arrange.isCenter) {
            this.props.inverse();
        } else {
            this.props.center();
        }
        e.stopPropagation();
        e.preventDefault();
    }
    render() {
        var styleObj = {};

        // 如果props属性中指定了这张图片 的位置，则使用
        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos
        }
        if (this.props.arrange.rotate) {
            ['MazTransform','msTransform','WebkitTransform','transform'].map(function(value){
                styleObj[value] = 'rotate(' +this.props.arrange.rotate+'deg)';
            }.bind(this));
          //  styleObj['transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';

        }
        let imgFigureClassName = "img-figure";
        imgFigureClassName += this.props.arrange.isInverse
            ? ' is-inverse'
            : '';
        if (this.props.arrange.isCenter) {
            styleObj['zIndex'] = 11;
        }
        return (
            <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
                <img src={this.props.data.imageURL} alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back">
                        <p>
                            {this.props.data.desc}
                        </p>
                    </div>
                </figcaption>
            </figure>

        )
    }
}

//img nav bar
class ControllerUnit extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e) {
        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }
        e.stopPropagation();
        e.preventDefault();
    }
    render() {
        let controllerUnitClassName = "controller-unit";
        //是否居中
        if(this.props.arrange.isCenter){
            controllerUnitClassName += " is-center"
            if(this.props.arrange.isInverse){
                controllerUnitClassName += " is-inverse"
            }
        }
        return (
            <span className={controllerUnitClassName} onClick={this.handleClick}></span>
        )
    }
}

//主舞台
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

        };
    }
    state = {
        imgsArrangeArr: [
            // {
            //     pos: {
            //         left: '0',
            //         top: '0'
            //     },
            //     rotate:0,
            //     isInverse:false,
            //     isCenter:false
            // }
        ]
    }
    /*
     *翻转图片
     *@param index 传入当前被执行inverse操作的图片对应的图片信息数组的index值
     * @return {Function} 闭包函数
     */
    inverse(index) {
        var _self = this;
        return function() {
            var imgsArrangeArr = _self.state.imgsArrangeArr;

            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
            _self.setState({imgsArrangeArr: imgsArrangeArr})
        }
    }
    /*
    * 重新布局说有图片
    * @param centerIndex 指定居中排布哪个图片
    */
    rearrange(centerIndex) {
        var imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeTopY = vPosRange.topY,
            vPosRangeX = vPosRange.x,

            imgsArrangeTopArr = [],
            topImgNum = Math.floor(Math.random() * 2), // 取一个或者不取
            topImgSpliceIndex = 0,

            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

        //首先居中 centerIndex 的图片
        imgsArrangeCenterArr[0] = {
            pos: centerPos,
            rotate: 0,
            isInverse: false,
            isCenter: true
        }

        //取出要布局上侧的图片状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        //布局上侧的图片
        imgsArrangeTopArr.map(function(value, index) {
            imgsArrangeTopArr[index] = {
                pos: {
                    top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                    left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                },
                rotate: get30DegRandom(),
                isInverse: false,
                isCenter: false

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
                },
                rotate: get30DegRandom(),
                isInverse: false,
                isCenter: false
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

    componentDidMount() {

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
                    },
                    rotate: 0,
                    isInverse: false
                }
            }
            imgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index} arrange={_self.state.imgsArrangeArr[index]} inverse={_self.inverse(index)} center={_self.center(index)} key={index}/>);
            controllerUnits.push(<ControllerUnit  arrange={_self.state.imgsArrangeArr[index]} inverse={_self.inverse(index)} center={_self.center(index)}  key={index} />)
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
