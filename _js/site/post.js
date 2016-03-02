/*global $svjq, _, FastClick, _h */


// ==|== FastClick ================================================================================ //

( function ( d ) {

    'use strict';

    if ( !d.querySelectorAll || !d.addEventListener ) {
        // Testing for addEventListener to make early exit in old IE (8).
        return;
    }

    _h.attachFastClick = function ( elms ) {

        var i, j;

        function attachFastClick( el ) {

            if ( !_.isObject( el ) ) {
                return;
            }
            if ( el.nodeType === 1 ) {
                // Single element
                FastClick.attach( el );
                return;
            }
            if ( el.length ) {
                // NodeList - make recursive call for each node.
                for ( i = 0, j = el.length; i < j; i += 1 ) {
                    attachFastClick( el[ i ] );
                }
                return;
            }

        }

        // Must be a DOM node or nodeList - no jQuery objects please.
        _.each( elms, attachFastClick );

    };

    _h.init( function () {
        _h.attachFastClick( [
            d.querySelector( '.hamburger' )
        ] );
    } );

}( document ) );


( function ( win, $ ) {

    'use strict';

    var $header, $footer, $content;

    function stickyFooter() {
        var h = $header.outerHeight() + $footer.outerHeight() + 55;
        $content.css( 'min-height', 'calc( 100vh - ' + h + 'px )' );
    }

    $( function () {

        $header = $( '.tmpl__header' );
        $content = $( '.tmpl__main' );
        $footer = $( '.tmpl__footer' );

        $( win ).on( 'resize', _.debounce( stickyFooter ) );
        stickyFooter();

    } );

}( window, $svjq ) );