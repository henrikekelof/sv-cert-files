/*global jQuery, _b */

( function ( $ ) {

    'use strict';

    var hasLeftBox,
        isOpen,
        $searchBox,
        $searchBoxInput,
        $submitBtn;

    function open() {
        isOpen = true;

        $submitBtn
            .css( {
                transform: 'rotate( -90deg )'
            } )
            .addClass( 'is-open' );
        $searchBox
            .removeClass( 'hidden' )
            .animate( {
                width: 400
            }, {
                duration: 300,
                complete: function () {
                    if ( $searchBoxInput.val() === $searchBoxInput.attr( 'placeholder' ) ) {
                        $searchBoxInput.val( '' );
                    }
                    $searchBoxInput.focus();
                }
            } );
    }

    function close() {
        isOpen = false;
        $submitBtn
            .css( {
                transform: 'rotate( 0deg )'
            } )
            .removeClass( 'is-open' );
        $searchBox.animate( {
            width: 32
        }, {
            duration: 300,
            complete: function () {
                $searchBox.addClass( 'hidden' );
            }
        } );
    }

    function checkForBlur() {
        hasLeftBox && close();
    }

    function init() {

        if ( _b.isEditMode ) {
            return;
        }

        $searchBox = $( '.searchBox' );
        $submitBtn = $searchBox.find( '.searchBox__submit' );
        $searchBoxInput = $searchBox.find( '.searchBox__input' );

        $searchBox
            .find( '.searchBox__input, .searchBox__submit' )
            .on( 'focus', function () {
                hasLeftBox = false;
                !isOpen && open();
            } );

        $searchBox
            .find( '.searchBox__submit' )
            .on( 'click', function () {
                hasLeftBox = false;
                open();
            } );

        $searchBox
            .find( '.searchBox__input, .searchBox__submit' )
            .on( 'blur', function () {
                hasLeftBox = true;
                setTimeout( checkForBlur, 100 );
            } );

    }

    $( init );

}( jQuery ) );