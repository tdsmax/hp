"use strict";
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

// This Method will create Multiple functions in the Sys object that can be used to test type of
['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Object', 'Array', 'Undefined']
    .forEach(
        function(name) {
            Sys['is' + name] = function(obj) {
                return toString.call(obj) == '[object ' + name + ']';
            };
        }
    );