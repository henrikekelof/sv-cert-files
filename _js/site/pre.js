/*global jQuery */

// ==|== Global Namespace Variables ==============================================================//

/**
 * Site script global namespace. Page or component specific code
 * should be placed under this namespace.
 */
var BV = BV || {},
    /**
     * Toolbox Library
     */
    _b = _b || {};



// ==|== Misc Toolbox Functions ================================================================= //

( function () {

    'use strict';

    [ 'Arguments', 'Array', 'Function', 'String', 'Number', 'Date', 'RegExp' ]
        .forEach( function ( name ) {
            _b[ 'is' + name ] = function ( obj ) {
                return Object.prototype.toString.call( obj ) === '[object ' + name + ']';
            };
        } );

    // Test for integer
    _b.isInt = function ( n ) {
        return Number( n ) === n && n % 1 === 0;
    };

    // Test for float
    _b.isFloat = function ( n ) {
        return n === Number( n ) && n % 1 !== 0;
    };

    function isObject( o ) {
        return o !== null && typeof o === 'object' && !Array.isArray( o );
    }

    function isObjectObject( o ) {
        return isObject( o ) === true && Object.prototype.toString.call( o ) === '[object Object]';
    }

    _b.isPlainObject = function ( o ) {

        var ctor, prot;

        if ( isObjectObject( o ) === false ) {
            return false;
        }

        // If has modified constructor
        ctor = o.constructor;
        if ( typeof ctor !== 'function' ) {
            return false;
        }

        // If has modified prototype
        prot = ctor.prototype;
        if ( isObjectObject( prot ) === false ) {
            return false;
        }

        // If constructor does not have an Object-specific method
        if ( prot.hasOwnProperty( 'isPrototypeOf' ) === false ) {
            return false;
        }

        // Most likely a plain Object
        return true;
    };

}() );

// ==|== Exec _h.init on DOMContentLoaded ======================================================= //

/**
 * Add functions or function names for functions to be executed on DOMContentLoaded.
 * Use inline in markup. Modules will tell the script which functions
 * need to be executed for the current page.
 * Pass as string to ensure function to only be executed once.
 *
 * <script> _b.init.push( 'M.fooBar' ) </script>
 * // => will execute M.foobar on DOMContentLoaded
 *
 * <script> _b.init.push( function () { alert( 'Hello' ) } ) </script>
 * // => will alert 'Hello' on DOMContentLoaded
 */


( function ( win, doc, $, undefined ) {

    'use strict';

    var functionsCalled = [];

    function getFunction( fn ) {

        var parts = fn.split( '.' ),
            currentFunction = window,
            i, l;

        for ( i = 0, l = parts.length; i < l; i += 1 ) {
            if ( !currentFunction[ parts[ i ] ] ) {
                return undefined;
            } else {
                currentFunction = currentFunction[ parts[ i ] ];
            }
        }

        if ( _b.isFunction( currentFunction ) ) {
            return currentFunction;
        }

    }


    function exec( f ) {

        if ( _b.isArray( f ) ) {
            f.forEach( exec );
            return;
        }

        if ( _b.isString( f ) ) {
            if ( functionsCalled.includes( f ) ) {
                return;
            }
            functionsCalled.push( f );
            f = getFunction( f );
        }

        if ( _b.isFunction( f ) ) {
            f();
        }

    }


    $( function () {
        if ( _b.init.length > 0 ) {
            _b.init.forEach( exec );
        }
    } );

}( window, document, jQuery ) );









