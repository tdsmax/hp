'use strict';

var React = require('react');
var ReactDOM = require('react-dom');


/*** Helper Utils ***/

/**
 * @description Util file :: From Vault
 * @author Tarandeep Singh
 * @created 2016-08-09
*/

var Sys = {};

Sys = {
    isEmptyObject: function(val){
        return this.isObject(val) && Object.keys(val).length;
    },
    /** This Returns Object Type */
    getType: function(val){
        return Object.prototype.toString.call(val);
    },
    /** This Checks and Return if Object is Defined */
    isDefined: function(val){
        return val !== void 0 || typeof val !== 'undefined';
    },
    /** Run a Map on an Array **/
    map: function(arr,fn){
        var res = [], i=0;
        for( ; i<arr.length; ++i){
            res.push(fn(arr[i], i));
        }
        arr = null;
        return res;
    },
    /** Checks and Return if the prop is Objects own Property */
    hasOwnProp: function(obj, val){
        return Object.prototype.hasOwnProperty.call(obj, val);
    },
    /** Extend properties from extending Object to initial Object */
    extend: function(newObj, oldObj){
        if(this.isDefined(newObj) && this.isDefined(oldObj)){
            for(var prop in oldObj){
                if(this.hasOwnProp(oldObj, prop)){
                    newObj[prop] = oldObj[prop];
                }
            }
            return newObj;
        }else {
            return newObj || oldObj || {};
        }
    }
};

/**
 * This isn't Required but just makes WebStorm color Code Better :D
 * */
Sys.isObject
    = Sys.isArguments
    = Sys.isFunction
    = Sys.isString
    = Sys.isArray
    = Sys.isUndefined
    = Sys.isDate
    = Sys.isNumber
    = Sys.isRegExp
    = "";

/** This Method will create Multiple functions in the Sys object that can be used to test type of **/

['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Object', 'Array', 'Undefined']
    .forEach(
        function(name) {
            Sys['is' + name] = function(obj) {
                return toString.call(obj) == '[object ' + name + ']';
            };
        }
    );

/**
 * @description Ajax Module ::  From Vault
 * @author Tarandeep Singh
 * @created 2016-08-12
 */

var HP = window.HP = window.HP||{};

HP.ajax = function(options) {

    // Define option defaults
    var defaults = {
        type: 'GET',
        url: "",
        dataType: 'application/json',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        cache: true,
        data: "",
        async: true,
        success: "",
        error: "",
        processData: false
    };

    // Create options by extending defaults with the passed in arugments
    if (Sys.isDefined(arguments[0]) && Sys.isObject(arguments[0])) {
        options = Sys.extend(defaults, arguments[0]);
    }

    // Utility method to extend defaults with user options
    var _construction = function () {

        if (Sys.isUndefined(XMLHttpRequest)) {
            XMLHttpRequest = function () {
                try {
                    return new ActiveXObject('Msxml2.XMLHTTP.6.0');
                }
                catch (e) {
                }
                try {
                    return new ActiveXObject('Msxml2.XMLHTTP.3.0');
                }
                catch (e) {
                }
                try {
                    return new ActiveXObject('Msxml2.XMLHTTP')
                }
                catch (e) {
                }

                throw new Error('this browser does not support XMLHttpRequest.')
            }
        }


        var xmlhttp = new XMLHttpRequest();

        xmlhttp.open(options.type, options.url);

        xmlhttp.onreadystatechange = function () {
            try {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    var response = "";
                    if (xmlhttp.responseText == "true") {
                        response = true;
                    }
                    else if (xmlhttp.responseText == "false") {
                        response = false;
                    }
                    else {
                        response = xmlhttp.responseText;
                    }
                    options.success(response);
                }
                else if (xmlhttp.readyState === 4 && xmlhttp.status !== 200) {
                    if (options.error) {
                        options.error(xmlhttp, xmlhttp.status, xmlhttp.responseText);
                    }
                    else {
                        console.log("Error in Ajax Call Not Handled");
                    }
                }
            } catch (e) {
                if (options.error) {
                    options.error(xmlhttp, 900, e.message);
                }
                else {
                    console.log("Caught Exception in Ajax Not Handled");
                }

            }

        };

        // Support For data Type as JSON
        if (options.dataType == 'json') {
            options.dataType = 'application/json';
        }

        // Process Data in Ajax
        if (Sys.isObject(options.data) && options.processData !== false) {
            var urldata = "";
            for (var key in options.data) {
                urldata += key + '=' + options.data[key] + '&';
            }
            options.data = urldata.slice(0, -1);
        }

        // Get AJAX
        if (options.type === "GET") {
            var url = "";
            if (Sys.isDefined(options.data) && options.data != "") {
                url = (options.url.indexOf('?') != -1) ? options.url + "&" + options.data : options.url + "?" + options.data;
            } else {
                url = options.url;
            }
            xmlhttp.open(options.type, url, true);
            xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xmlhttp.send();
        } else if (options.type === "POST") {
            xmlhttp.open(options.type, options.url, options.async);
            xmlhttp.setRequestHeader("Accept", options.dataType);
            xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xmlhttp.setRequestHeader("Content-Type", options.contentType);
            xmlhttp.send(options.data);
        } else {
            console.log("Ajax type not Known : Please Handle Accordinly ");
        }

    };
    _construction();
};



/**
 * Created by Tarandeep Singh on 02/08/16. :: Lightest Carousel Component : From Vault
 * @modified 2016-09-12 :: Added Support for Different Resolutions
 *
 */

(function(win,doc,undefined){

    /** Under Development **/

    var HP = win.HP = win.HP||{};

    HP.carousel = function(comp) {
        var mainComp = comp ? comp : doc.querySelectorAll('.carousel');
        if(mainComp){
            Array.prototype.forEach.call(mainComp,function(comp){
                _construction(comp);
            });
        }
        function _construction(comp){
            var _running = false;
            var ci = 0;
            var _compsContainer = comp.querySelector('.carouselSec');
            var _compsWidth = comp.offsetWidth;
            var _comps = comp.querySelectorAll('.carouselComp');
            var _compsLen = _comps.length;
            var _rightBtn = comp.querySelector('.rightBtn');
            var _leftBtn = comp.querySelector('.leftBtn');

            /*** No Carousel for single image ***/
            if(!_compsLen > 1){
                _leftBtn.classList.add('hide');
                _rightBtn.classList.add('hide');
                return 0;
            }
            /** Set Styling Made Responsive :: Not on Resize widow but for Different Resolution Load this should Work  **/
            _compsContainer.style.width = (_compsLen * _compsWidth) + "px";
            for(var i=0;i<_compsLen;i++){
                _comps[i].style.width = _compsWidth + "px";
            }

            var _avoidMultiClick = function(){
                _running = true;
                setTimeout(function(){
                    _running = false;
                },500);
            };

            var _right = function(){
                if(!_running){
                    if(ci<_compsLen-1){
                        _compsContainer.style['left'] = ++ci*-_compsWidth + 'px';
                        _avoidMultiClick();
                    }else {
                        _compsContainer.style['left'] = '0px';
                        _avoidMultiClick();
                        ci = 0;
                    }
                }
            };
            var _left = function(){
                if(!_running){
                    if(ci>0){
                        --ci;
                        _compsContainer.style['left'] = parseInt(_compsContainer.style['left']) + parseInt(_compsWidth) + 'px';
                        _avoidMultiClick();
                    }else {
                        ci = _compsLen -2;
                        _right();
                    }
                }
            };

            // TODO: Later
            var _autoplay = function(){

            };

            // TODO: Later
            var _destroy = function(){

            };

            _rightBtn.addEventListener("click",_right);
            _leftBtn.addEventListener("click",_left);

        }
    };

})(window,document);

/*** Helper Utils Ends Here ***/

/**** Main App ***/

(function(win,doc,undefined){
    var HP = win.HP || {};
    HP.rendered = false;
    /**
     * @description This is the main React and app Logic
     * @author Tarandeep Singh
     * @created 2016-09-11
     * */
    var container = "hotelsContainer";
    var errorContainer = "hotelErrorsContainer";
    var containerElem = doc.getElementById(container);
    var size = 5;
    var scrollCount = -1;
    var loadHotelsElem = doc.getElementById("loadHotels");
    var loadErrorsElem = doc.getElementById("loadErrors");

    /** Handle Ajax Calls Here **/
    var urls = {
        error: "http://fake-hotel-api.herokuapp.com/api/hotels?&force_error=true",
        hotels: "http://fake-hotel-api.herokuapp.com/api/hotels?&no_error=true",
        reviews: "http://fake-hotel-api.herokuapp.com/api/reviews?&no_error=true"
    };


    /**
     * @description This is Carousel React Component
     * @data It Expects array of images as Data
     * @author Tarandeep Singh : 2016-09-12
     * */
    var CarouselComp = React.createClass({
        render:  function(){
            var carousel =this.props.data.map(function(image,index){
                return (
                    <img key={index} className="hImg carouselComp" src={image} alt="Hotel Image Loading... "></img>
                )
            });
            return (
                <section className="carousel blk">
                    <div className="leftBtn">&#9664;</div>
                    <div className="carouselSec">
                        {carousel}
                    </div>
                    <div className="rightBtn">&#9654;</div>
                </section>
            );
        }
    });



    /**
     * @description This is Hotel React Component
     * @data It Expects Hotel Object as Data
     * @author Tarandeep Singh : 2016-09-12
     * */
    var Hotel = React.createClass({
        toggleReviews: function(event){
            var tar = event.currentTarget;
            var data = tar.getAttribute('data-toggle');
            var reviewElem = doc.getElementById(this.props.data.id).querySelector('.hReview');
            var cached = reviewElem.querySelector(".hReviewList");
            var cb = function(){
                tar.textContent = "Hide Reviews";
            };
            if(data === "show"){
                if(!cached){
                    _sendReviewsAjax(this.props.data.id,cb);
                }else {
                    cb();
                }
                tar.setAttribute('data-toggle','hide');
                reviewElem.classList.toggle('hide');
            }else {
                tar.textContent = "Show Reviews";
                tar.setAttribute('data-toggle','show');
                reviewElem.classList.toggle('hide');
            }
        },
        render: function () {
            var hotel = this.props.data;
            var ratings = [1,2,3,4,5].map(function(i,j){
                return (
                    i <= hotel.stars
                        ? <span key={j}>&#9733;</span>
                        : <span key={j}>&#9734;</span>
                )
            });
            return (
                <div id={hotel.id} className="hComp blk">
                    <section className="hSec">
                        <div className="hComp__left">
                            <CarouselComp data={hotel.images}></CarouselComp>
                        </div>
                        <div className="hComp__right blk">
                            <div className="hHead blk">
                                <div className="hTitle fLeft">
                                    <h2 className="hName text-capitalize">{hotel.name}</h2>
                                    <h4 className="hCityCon text-capitalize">{hotel.city + " - " + hotel.country}</h4>
                                </div>
                                <div className="mtb-20 hRating fRight">
                                    {ratings}
                                </div>
                            </div>
                            <div className="hDesc blk">
                                {hotel.description}
                            </div>
                            <div className="hRevPrice blk">
                                <button className="btn fLeft" data-toggle="show" onClick={this.toggleReviews} id="showReviews">Show Reviews</button>
                                <div className="hPrTm fRight">
                                    <div className="hPrice">{hotel.price} &#8364;</div>
                                    <div className="hTime">{hotel.date_start.substr(0,10).split('-').reverse().join('-')} - {hotel.date_end.substr(0,10).split('-').reverse().join('-')}</div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div className="hReview hide"></div>
                </div>
            );
        }
    });


    /**
     * @description This is HotelReview React Component
     * @data It Expects array of review Objects as Data
     * @author Tarandeep Singh : 2016-09-12
     * */
    var HotelReview = React.createClass({
        render: function () {
            var data = this.props.data;
            var reviews =
                data && data.length > 0
                    ? this.props.data.map(function (review, index) {
                    return (
                        <div key={index} className="rev blk">
                            <div className="revIcon">
                                <div className="revSign">{review.positive ? '+' : '-'}</div>
                            </div>
                            <section className="revDetail">
                                <div className="revTitle">{review.name}</div>
                                <div className="revComment">{review.comment}</div>
                            </section>
                        </div>
                    );
                })
                    : <div className="noData">Yet to be Reviewed..  </div>;
            return (
                <div className="hReviewList">
                    {reviews}
                </div>
            );
        }
    });

    /**
     * @description This is the Main App Holiday Hotels React Component: It Shows list of hotels on Load Hotels click
     * @author Tarandeep Singh
     * @created 2016-09-12
     * */
    var HolidayHotels = React.createClass({
        render: function () {
            var hotels = this.props.data.map(function (hotel, index) {
                return (
                    <Hotel key={index} data={hotel}></Hotel>
                );
            });
            return (
                <div className="hList">{hotels}</div>
            );
        }
    });



    /**
     * @description This is main Rendered Function called for Rendeing Hotel List
     * @data It Expects HotelList as Data from Ajax Results
     * @author Tarandeep Singh : 2016-09-12
     * */
    function _renderHotel(data, scrollCount,cb) {
        var id = container + scrollCount;
        if (!doc.getElementById(id)) {
            var elem = doc.createElement("div");
            elem.id = id;
            elem.class = "hCont";
            containerElem.appendChild(elem);
        }
        ReactDOM.render(
            <HolidayHotels data={data}/>,
            doc.getElementById(id),
            function(){
                /** Initialize Carousel on Hotels Here **/
                HP.rendered = true;
                HP.carousel();
                if(Sys.isDefined(cb) && Sys.isFunction(cb)){
                    cb.call(this);
                }
            }
        );
    }


    /**
     * @description This is Review Rendering Function
     * @data It Expects data from Ajax call for Reviews and rendering ID
     * @author Tarandeep Singh : 2016-09-12
     * */
    function _renderReviews(data,id,cb) {
        ReactDOM.render(
            <HotelReview data={data}/>,
            doc.getElementById(id).querySelector(".hReview"),
            function(){
                if(Sys.isDefined(cb) && Sys.isFunction(cb)){
                    cb.call(this);
                }
            }
        );
    }

    /**
     * @description This function is called to Bring Hotel Data From API
     * @data It Expects data from Ajax call for Reviews and rendering ID
     * @author Tarandeep Singh : 2016-09-12
     * */
    function _sendHotelsAjax(cb){
        HP.ajax({
            url: urls.hotels + "&count=" + size,
            success: function (res) {
                _renderHotel(JSON.parse(res), ++scrollCount,cb);
            },
            error: function (res) {
                _renderError(JSON.parse(res.responseText).error,errorContainer);
            }
        });
    }

    /**
     * @description This function is called to Bring Review Data From API for particular hotel
     * @data It Expects data from Ajax call for Reviews and rendering ID
     * @author Tarandeep Singh : 2016-09-12
     * */
    function _sendReviewsAjax(id,cb){
        HP.ajax({
            url: urls.reviews + "&hotel_id=" + id,
            success: function (res) {
                res = JSON.parse(res);
                _renderReviews(res,id,cb);
            },
            error: function (res) {
                _renderError(JSON.parse(res.responseText).error,errorContainer);
            }
        });
    }


    /**
     * @description This is helper function to be called post successful hotels Data
     * @data It Expects data from Ajax call for Reviews and rendering ID
     * @author Tarandeep Singh : 2016-09-12
     * */
    function hideLoadHotels(){
        loadHotelsElem.classList.add("btn--hide");
        doc.getElementById(errorContainer).classList.add("btn--hide");
    }


    /**
     * @description This function is Used to Attach Ajax Application Load Call
     * @data It Expects data from Ajax call for Reviews and rendering ID
     * @author Tarandeep Singh : 2016-09-12
     * */
    loadHotelsElem.addEventListener('click',function(){
        _sendHotelsAjax(hideLoadHotels);
    });



    /**** Scroll Pagination ****/

    win.onscroll = function (ev) {
        // Updated this height for fix in IOS Mac, Safari
        if ((win.innerHeight + win.scrollY) >= doc.body.scrollHeight - 10) {
            if (HP.rendered) {
                HP.rendered = false;
                _sendHotelsAjax();
            }
        }
    };

    /*** Scroll Pagination Ends Here ***/



    /*** Just For Testing Purpose **/

        /**
         * @description This is Render Error
         * @data It Expects data from Ajax call on Error
         * @author Tarandeep Singh : 2016-09-12
         * */
        function _renderError(data,id,cb) {
            ReactDOM.render(
                <div className="error">{data}</div>,
                doc.getElementById(id),
                function(){
                    if(Sys.isDefined(cb) && Sys.isFunction(cb)){
                        cb.call(this);
                    }
                }
            );
        }

        /**
         * @description This is helper function to be called post successful hotels Data
         * @data It Expects data from Ajax call for Reviews and rendering ID
         * @author Tarandeep Singh : 2016-09-12
         * */
        function hideErrorHotels(){
            loadErrorsElem.classList.add("btn--hide");
        }

        function _sendHotelsErrorAjax(cb){
            HP.ajax({
                url: urls.error,
                error: function (res) {
                    _renderError(JSON.parse(res.responseText).error,errorContainer,cb);
                }
            });
        }

        loadErrorsElem.addEventListener('click',function(){
            _sendHotelsErrorAjax(hideErrorHotels);
        });

    /*** Error Testing Ends Here ***/
})(window,document);
