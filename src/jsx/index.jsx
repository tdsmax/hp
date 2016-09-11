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


var container = "hotelsContainer";
var containerElem = document.getElementById("hotelsContainer");
var size = 10;
var scrollCount = -1;
var loadHotelsElem = document.getElementById("loadHotels");
// Handle Ajax Calls Here
var urls = {
    hotels: "http://fake-hotel-api.herokuapp.com/api/hotels",
    reviews: "http://fake-hotel-api.herokuapp.com/api/reviews"
};

var Hotel = React.createClass({
    showReviews: function(){
        _sendReviewsAjax(this.props.data.id);
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
            <div id={hotel.id} className="hComp">
                <div className="hComp__left">
                    <img className="hImg" src={hotel.images[0]} alt="Hotel Image"></img>
                </div>
                <div className="hComp__right">
                    <div className="hTitle fLeft">
                        <h2 className="hName">{hotel.name}</h2>
                        <h4 className="hCityCon">{hotel.city + " - " + hotel.country}</h4>
                    </div>
                    <div className="hRating fRight">
                        {ratings}
                    </div>
                    <div className="hDesc">
                        {hotel.description}
                    </div>
                    <div className="hRevPrice">
                        <button className="btn btn--large fLeft" onClick={this.showReviews} id="showReviews">Show Reviews</button>
                        <div className="hPrTm">
                            <div className="hPrice">{hotel.price} &#8364;</div>
                            <div className="hTime">{hotel.date_start} - {hotel.date_end}</div>
                        </div>
                    </div>
                </div>
                <div className="hReview"></div>
            </div>
        );
    }
});
var HotelReview = React.createClass({
    render: function () {
        var reviews = this.props.data.map(function (review, index) {
            return (
                <div key={index}>{review.comment}</div>
            );
        });
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
            console.log("Render Complete !!");
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
            console.log("Review Render Complete !!");
            if(Sys.isDefined(cb) && Sys.isFunction(cb)){
                cb.call(this);
            }
        }
    );
}

function _sendHotelsAjax(cb){
    HP.ajax({
        url: urls.hotels + "?&count=" + size,
        success: function (res) {
            res = JSON.parse(res);
            _renderHotel(res, ++scrollCount,cb);
        },
        error: function (res) {
            console.log(res);
        }
    });
}

function _sendReviewsAjax(id,cb){
    HP.ajax({
        url: urls.reviews + "?&hotel_id=" + id,
        success: function (res) {
            res = JSON.parse(res);
            _renderReviews(res,id,cb);
        },
        error: function (res) {
            console.log(res);
        }
    });
}

function hideLoadHotels(){
    loadHotelsElem.classList.add("btn--hide");
}

loadHotelsElem.addEventListener('click',function(){
    _sendHotelsAjax(hideLoadHotels());
});