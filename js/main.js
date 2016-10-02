(function () {
    'use strict';           	//  this function is strict... prevents use of undeclared variables
    /*globals $:false */		//	prevent jshint from declaring $ as undefined

    //**************************************************************************
    //  Global Variables
    //**************************************************************************

    var totalCost = 0;          //  total conference cost
    var creditCard = false;     //  credit card selection flag
    //  various Regular Expressions for validations
    var reMail = new RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);   //  from https://www.w3.org/TR/html-markup/input.email.html#input.email.attrs.value.multiple
    var reZip = new RegExp(/(^\d{5}$)|(^\d{5}-\d{4}^\d{5}[ ]\d{4}$)/);
    var reCVV = new RegExp(/(\d{3}$)/);

    var test = true;
    var errMark = '';

    //  End of Global Variables
    //**************************************************************************

    //**************************************************************************
    //  functions
    //**************************************************************************

    //  tests all the testable elements for validity & and returns a boolean validity result
    //  Validation Rules
    //      Name field is populated
    //      Email is populated and correctly formatted xxx@xxx.xxx
    //      At least one Activity is selected
    //      A payment option must be selected
    //          if credit card - must have 16 digit number, zip code, and CVV
    //

    function validForm() {
        errMark = '';                 //  resets the holder of the first encountered error, we direct focus to that element on correction cycle
        $ (".err").remove ();         //  clear all previously posted error messages
        if ($ ("#name").val ().length < 1) {
            $ ("#nameLabel").append ('<span class="err"> &#x26D4</span>');
            test = false;
            if (errMark === '') {
                errMark = '#name';
            }
        }

        if ($ ("#mail").val () === undefined || !($ ("#mail").val ().match (reMail))) {
            $ ("#mailLabel").append ('<span class="err"> &#x26D4</span>');
            test = false;
            if (errMark === '') {
                errMark = '#mail';
            }
        }

        if (totalCost === 0) {
            $ ("#activities").append ('<small class="err" style="color: red;"><small></small> Please Select at least One Activity</small></span>');
            test = false;
            if (errMark === '') {
                errMark = '#activities';
            }
        }

        if (creditCard) {
            //  first test validity with Luhn algorithm
            var ccNum = $ ("#cc-num").val ();

            if (!( validCreditCard (ccNum) )) {
                $ ("#ccLabel").append ('<span class="err"> &#x26D4</span>');
                test = false;
                if (errMark === '') {
                    errMark = '#credit-card';
                }
            }

            //  test for valid zip code format
            if (!( $ ("#zip").val ().match (reZip))) {
                $ ("#zipLabel").append ('<span class="err"> &#x26D4</span>');
                test = false;
                if (errMark === '') {
                    errMark = '#zip';
                }
            }

            //  test for valid cvv
            if (!( $ ("#cvv").val ().match (reCVV))) {
                $ ("#cvvLabel").append ('<span class="err"> &#x26D4</span>');
                test = false;
                if (errMark === '') {
                    errMark = '#cvv';
                }
            }
        }
        return test;
    }

    //  takes the credit card form field value and returns true on valid number

    //  from https://gist.github.com/DiegoSalazar/4075533 - used with permission

    //  I changed the name to camel case because I don't like underscores (no good reason)
    //
    //  there are card brand specific test @ http://www.freeformatter.com/credit-card-number-generator-validator.html
    //  I am not using them because we are not asking for card brand, but I am aware of them
    //
    function validCreditCard(value) {
        // accept only digits, dashes or spaces
        if (/[^0-9-\s]+/.test(value)) return false;         //  false = any characters except digits, spaces or dashes

        // The Luhn Algorithm. It's so pretty.
        //  nCheck is the accumulated check digit; nDigit is the current digit; bEven is the odd/even indicator

        var nCheck = 0, nDigit = 0, bEven = false;
        value = value.replace(/\D/g, "");                  //  strip out non digits

        for (var n = value.length - 1; n >= 0; n--) {      //   cycle form end of string to front
            var cDigit = value.charAt(n);
                nDigit = parseInt(cDigit, 10);

            if (bEven) {
                if ((nDigit *= 2) > 9) nDigit -= 9;
            }

            nCheck += nDigit;
            bEven = !bEven;

        }

        return (nCheck % 10) === 0;
    }

    //  end of functions
    //**************************************************************************
    //**************************************************************************
    //  event listeners
    //**************************************************************************
    $("#title").change(function(e) {
        if ( e.target.value == "other" ) {
            $("#other-title").show();         // 'other' job title, show input element
            $("#other-title").focus();        // and give it focus
        } else {
            $("#other-title").hide();        //  hide when changed to non-other
        }
    });

    //  fieldset 1 - T-shirt info
    //  T-shirt color selection
    //      if Theme = JS Puns (Only Cornflower Blue, Dark Slate Gray, Gold)
    //      if Theme = I <3 JS (Only Tomato, Steel Blue, Dim Gray)
    $("#design").change(function(e) {
        if ( e.target.value == "Select Theme" ) {
            $('#colors-js-puns').hide();
            $('#color').empty();
        } else {
            if ( e.target.value ==  "js puns") {                //  design option 1 colors
                $('#colors-js-puns').show();
                $("#color").html("<option value='cornflowerblue'>Cornflower Blue</option><option value='darkslategrey'>Dark Slate Grey</option><option value='gold'>Gold</option>");
            } else {                                            //  design option 2 colors
                $('#colors-js-puns').show();
                $("#color").html("<option value='tomato'>Tomato</option><option value='steelblue'>Steel Blue</option><option value='dimgrey'>Dim Grey</option>");
            }
        }
    });

    //  fieldset 2 - Activities
    //  Check Activities
    //      Main Conference                         $200
    //      Workshops Optional
    //          JS Frameworks WS - Tue 9am-12pm     $100    (Conflicts w/Express)
    //          JS Libraries WS  - Tue 1pm-4pm      $100    (Conflicts w/Node.js)
    //          Express WS       - Tue 9am-12pm     $100    (Conflicts w/JS Frameworks)
    //          Node.js WS       - Tue 1pm-4pm      $100    (Conflicts w/JS Libraries)
    //          Build Tools WS   - Wed 9am-12pm     $100
    //          npm WS           - Wed 1pm-4pm      $100

    // build registration activities and total cost
    $('.activities :checkbox').change(function(e) {

        //  get activity, potential conflict of this checkbox
        var activity = '';
        var conflict = '';
        if ( e.target.parentElement.id.indexOf("|") !=-1 ) {
            activity = e.target.parentElement.id.split("|")[0];
            conflict = e.target.parentElement.id.split("|")[1];
            var conflictWith = '';
            var n = parseInt(conflict);
            // switch conflict pointer to the conflict partner
            switch (n) {
                case 1:
                    conflictWith='3';
                    break;
                case 2:
                    conflictWith='4';
                    break;
                case 3:
                    conflictWith='1';
                    break;
                default:
                    conflictWith='2';
            }
        } else {
            activity = e.target.parentElement.id;
        }

        // this will contain a reference to the checkbox
        if (this.checked) {
            // the checkbox is now checked - increase totalCost
            totalCost += parseInt((e.target.parentElement.innerText).split("$")[1]);

            //  with conflict, disable conflicting activity
            if (activity == "Tue:am" || activity == "Tue:pm") {
                // then do stuff to each of the other check boxes
                $(".activities > label").each (function() {
                    // check to see if they are registered for conflicting workshop as well
                    if ( this.id  == (activity+"|"+conflictWith) ) {
                        //disable other check boxes of the same type
                        $(this).find("input:not(:checked)").prop('disabled', true);
                        // append some text to the unchecked boxes of the same type showing that the morning has been booked
                        $(this).find("input:not(:checked)").parent().append('<small id="conflict" style="color: yellow;"><em> ('+activity+' Booked)</em></small>');
                    }
                });
            }
        } else {
            // the checkbox is now no longer checked - decrease totalCost
            totalCost -= parseInt((e.target.parentElement.innerText).split("$")[1]);
            //  with conflict, enable conflicting activity
            if (activity == "Tue:am" || activity == "Tue:pm") {
                // then do stuff to each of the other check boxes
                $(".activities > label").each (function() {
                    // check to see if they are registered for conflicting workshop as well
                    if ( this.id  == (activity+"|"+conflictWith) ) {
                        //enable other check boxes of the same type
                        $(this).find("input:not(:checked)").prop('disabled', false);
                        // remove the conflicting booking message
                        $(this).find('#conflict').remove();
                    }
                });
            }
        }
        $("#totCost").text(totalCost);
    });

    //  fieldset 3 - Payment
    //  Payment Information
    //      Options - Mutually exclusive (Fields dynamic based on choice)
    //          Credit Card
    //          PayPal
    //          Bitcoin
    //

    $("#payment").change(function(e) {
        $('.payerr').remove();
        creditCard = false;
        
        switch (e.target.value) {
            case "credit card":
                $("#paypal").hide();
                $("#bitcoin").hide();
                //enable credit card selection
                creditCard = true;
                $("#credit-card").show();
                $("#cc-num").focus();
                break;
            case "paypal":
                $("#credit-card").hide();
                $("#bitcoin").hide();
                $("#paypal").show();
                break;
            case "bitcoin":
                $("#credit-card").hide();
                $("#paypal").hide();
                $("#bitcoin").show();
                break;
            default:
                $("#credit-card").hide();
                $("#paypal").hide();
                $("#bitcoin").hide();
                $('#payLabel').append("<span class='payerr' style='color: red'><small> Select a Valid Payment Method</small></span>");
        }
    });

    //  submit the form
    //debugger;
    $("form").submit(function() {

        if ( !validForm() ) {               //  this is the 'failed' block
            $("form").append('<p class="err" style="color: red;"><small>Please correct entry error(s)!</small></p>');
            $(errMark).focus();       //  set focus on first error field
            test=true;                //  set to true for recheck of this form , else run the risk of staying forever false
            event.preventDefault();   //  ensures that submit doesn't take place
        } else {                            //  this is the 'true' block
            $ ('.err').remove ();       //  remove previous error messages
            test = true;                //  set to true for next form check, to assure we don't stay forever false
            $ ("#name").focus();        //  set focus on name of next form
        }

    });

    //  End of event listeners
    //**************************************************************************
    //**************************************************************************
    //      Inline Processing
    //**************************************************************************

    //  Set focus on Name field
    $("#name").focus();

    //  initialize all checkboxes as active

    //  identify fieldsets uniquely.
    $('fieldset').each(function(index) {
        $(this).attr("id", "fieldset-" + (index));
    });

    //  fieldset 0 - basic info
    //  get 'other' information and hide it until needed
    $('#fieldset-0').append("<input type='text' id='other-title' placeholder='Your Title...' name='otherTitle'>");
    $('#other-title').hide();

    //  fieldset 1 - T shirts
    //  initially hide color selector

    $('#colors-js-puns').hide();
    $('#color').empty();

    //  fieldset 2 - Activities
    //  Index the labels to make it easier to access

    $(".activities > label").each(function(index) {
        var text = $(this).text();
        //
        //  Note to self: tried to use switch but switch only compares for equality
        //      so, switch(text)
        //          case (text.indexOf("Tuesday 9") != -1) always evaluates to false
        //              it is equivalent to: if ((text === (text.indexOf("Tuesday 9") != -1)) { do stuff }
        //      Another trap: miss a break statement and the logic falls through to the next case
        //      USE WITH CAUTION
        //
        if (text.indexOf("Tuesday 9") != -1) {
            if ( index == 1 ) {
                $(this).attr("id","Tue:am|3");
            } else {
                $(this).attr("id","Tue:am|1");
            }
        } else if (text.indexOf("Tuesday 1") != -1) {
            if ( index == 2 ) {
                $(this).attr("id","Tue:pm|4");
            } else {
                $(this).attr("id","Tue:pm|2");
            }
        } else if (text.indexOf("Wednesday 9") != -1) {
            $(this).attr("id","Wed:am");
        } else if (text.indexOf("Wednesday 1") != -1) {
            $(this).attr("id","Wed:pm");
        } else {
            $(this).attr("id","Main");
        }
    });
    $('#fieldset-2').append("<p>Total Registration Cost: $<span id='totCost'>"+totalCost+"</span></p>");     //  initialize totalCost display

    //  fieldset 3 - Payment
    //  Payment Information
    //  hide components for re showing them based on selection, except for credit card

    $("#paypal").hide();
    $("#bitcoin").hide();

}());

// Things to remember for the future:
//
//  from Andy Stoica
//
//  When you call the jQuery function ($) it returns a jQuery object which has a number of elements but crucially, also the jQuery protocol. By accessing an individual element on this object using the bracket [n] notation, you are effectively loosing the jQuery protocol so you are left only with an HTML element instead. The workaround is to use jQuery’s eq() function instead of bracket notation which will return the individual HTML element wrapped inside a jQuery object which brings the protocol with it. In your example that would be $(“.activities label”).eq(n). Is this what you were trying to find out?
// Answer:  Yes!!!
