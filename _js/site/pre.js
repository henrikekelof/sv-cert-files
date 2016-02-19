/*global $svjq, _ */

// ==|== Global Namespace Variables =============================================================== //

/**
 * Site script global namespace. Page or component specific code
 * should be placed under this namespace.
 */
var H = H || {},
    /**
     * Toolbox Library
     */
    _h = _h || {};


// ==|== Add to init and exec on DOMContentLoaded ================================================= //

( function ( win, doc, undefined ) {

    'use strict';

    var functions       = [],
        functionsCalled = [],
        currentFunction,
        isInitiated     = false;

    function include( fn ) {
        functions.push( fn );
    }


    function getFunction( fn ) {

        if ( typeof fn === 'function' ) {
            return fn;
        }

        var parts = fn.split( '.' ),
            i,
            l;

        for ( i = 0, l = parts.length; i < l; i += 1 ) {

            if ( !currentFunction[ parts[ i ] ] ) {
                return undefined;
            } else {
                currentFunction = currentFunction[ parts[ i ] ];
            }
        }
        return currentFunction;
    }


    function exec( fns ) {

        var fn, i, l;

        fns = fns || functions;

        for ( i = 0, l = fns.length; i < l; i += 1 ) {

            currentFunction = win;

            if ( _.isString( fns[ i ] ) && functionsCalled.indexOf( fns[ i ] ) === -1 ) {

                functionsCalled.push( fns[ i ] );
                fn = getFunction( fns[ i ] );

                if ( typeof fn === 'function' ) {
                    fn();
                }

            }
        }

    }


    /**
     * Add function names for functions to be executed on DOMContentLoaded.
     * Use inline in markup. Modules will tell the script which functions
     * need to be executed for the current page.
     * Any named function may be added multiple times but will only
     * be executed once
     *
     * <script> _h.init( 'M.fooBar' ) </script>
     * // => will execute M.foobar on DOMContentLoaded
     *
     * <script> _h.init( function () { alert( 'Hello' ) } ) </script>
     * // => will alert 'Hello' on DOMContentLoaded
     */
    _h.init = function ( fn ) {

        if ( isInitiated ) {
            if ( _.isString( fn ) ) {
                fn = [ fn ];
            }
            exec( fn );
            return;
        }

        if ( !fn || ( _.isObject( fn ) && fn.target ) ) {
            if ( functions.length > 0 ) {
                exec();
            }
            isInitiated = true;
            return;
        }

        if ( _.isString( fn ) || typeof ( fn ) === 'function' ) {
            include( fn );
        } else if ( _.isArray( fn ) ) {
            fn.forEach( function ( f ) {
                include( f );
            } );
        }

    };

    //    _h.inInit = function ( s ) {
    //        return ( functions.indexOf( s ) > -1 || functionsCalled.indexOf( s ) > -1 );
    //    };

    doc.addEventListener( 'DOMContentLoaded', _h.init );

}( window, document ) );






