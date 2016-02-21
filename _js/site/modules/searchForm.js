/*global $svjq */

( function ( $ ) {

    'use strict';

    var $form,
        $hamburger,
        $menu;

    function handleFocus() {
        $form
            .addClass( 'focused' )
            .find( '.searchForm__input' )
            .focus();
    }

    function handleBlur() {
        $form
            .removeClass( 'focused' );
    }

    function handleHamburger() {
        $menu.toggleClass( 'visible' );
        $hamburger.toggleClass( 'visible' );
    }

    function init() {
        $form = $( '.searchForm' );
        $menu = $( '.tmpl__header ul' );
        $hamburger = $( '.hamburger' );
        $form
            .on( 'mouseenter', handleFocus )
            .find( '.searchForm__input' )
                .on( 'focus', handleFocus )
                .on( 'blur', handleBlur );
        $hamburger.on( 'click', handleHamburger );
    }

    $( init );

}( $svjq ) );