'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

/**
 * @description Util file
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

Sys.isObject = Sys.isArguments = Sys.isFunction = Sys.isString = Sys.isArray = Sys.isUndefined = "";

// This Method will create Multiple functions in the Sys object that can be used to test type of
['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Object', 'Array', 'Undefined']
    .forEach(
        function(name) {
            Sys['is' + name] = function(obj) {
                return toString.call(obj) == '[object ' + name + ']';
            };
        }
    );

/**
 * @description Ajax Module
 * @author Tarandeep Singh
 * @created 2016-09-07
 */

/* Define our constructor*/
"use strict";
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
 * @description This is the main React and app Logic
 * @author Tarandeep Singh
 * @created 2016-09-11
 * */

var container = "hotelsContainer";
var errorContainer = "hotelErrorsContainer";
var containerElem = document.getElementById(container);
var size = 5;
var scrollCount = -1;
var loadHotelsElem = document.getElementById("loadHotels");
var loadErrorsElem = document.getElementById("loadErrors");

// Handle Ajax Calls Here
var urls = {
    error: "http://fake-hotel-api.herokuapp.com/api/hotels?&force_error=true",
    hotels: "http://fake-hotel-api.herokuapp.com/api/hotels?&no_error=true",
    reviews: "http://fake-hotel-api.herokuapp.com/api/reviews?&no_error=true"
};

var Hotel = React.createClass({
    toggleReviews: function(event){
        var tar = event.currentTarget;
        var data = tar.getAttribute('data-toggle');
        var reviewElem = document.getElementById(this.props.data.id).querySelector('.hReview');
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
                <div className="hComp__left">
                    <img className="hImg" src={hotel.images[0]} alt="Hotel Image"></img>
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
                <div className="hReview hide"></div>
            </div>
        );
    }
});


var HotelReview = React.createClass({
    render: function () {
        var data = this.props.data;
        var reviews =
            data && data.length > 0
                ? this.props.data.map(function (review, index) {
                        return (
                            <div key={index}>{review.comment}</div>
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

function _renderHotel(data, scrollCount,cb) {
    var id = container + scrollCount;
    if (!document.getElementById(id)) {
        var elem = document.createElement("div");
        elem.id = id;
        elem.class = "hCont";
        containerElem.appendChild(elem);
    }
    ReactDOM.render(
        <HolidayHotels data={data}/>,
        document.getElementById(id),
        function(){
            if(Sys.isDefined(cb) && Sys.isFunction(cb)){
                cb.call(this);
            }
        }
    );
}

function _renderReviews(data,id,cb) {
    ReactDOM.render(
        <HotelReview data={data}/>,
        document.getElementById(id).querySelector(".hReview"),
        function(){
            if(Sys.isDefined(cb) && Sys.isFunction(cb)){
                cb.call(this);
            }
        }
    );
}

function _renderError(data,id,cb) {
    ReactDOM.render(
        <div className="error">{data}</div>,
        document.getElementById(id),
        function(){
            if(Sys.isDefined(cb) && Sys.isFunction(cb)){
                cb.call(this);
            }
        }
    );
}

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

function hideLoadHotels(){
    loadHotelsElem.classList.add("btn--hide");
}

loadHotelsElem.addEventListener('click',function(){
    _sendHotelsAjax(hideLoadHotels);
});


/*** Just For Testing Purpose **/

function _sendHotelsErrorAjax(){
    HP.ajax({
        url: urls.error,
        error: function (res) {
            _renderError(JSON.parse(res.responseText).error,errorContainer);
        }
    });
}

loadErrorsElem.addEventListener('click',function(){
    _sendHotelsErrorAjax();
});