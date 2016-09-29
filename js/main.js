(function () {
    'use strict';           	//  this function is strict... prevents use of undeclared variables
    /*globals $:false */		//	prevent jshint from declaring $ as undefined

    //**************************************************************************
    //  Global Variables
    //**************************************************************************

    var totalCost = 0;          //  total conference cost

    //  End of Global Variables
    //**************************************************************************

    //**************************************************************************
    //  functions
    //**************************************************************************
    function titleListener() {
        $("#title").change(function(e) {
            if ( e.target.value == "other" ) {
                $("#other-title").show();         // 'other' job title, show input element
                $("#other-title").focus();        // and give it focus
            } else {
                $("#other-title").hide();        //  hide when changed to non-other
            }
        });
    }

    function designListener() {
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
    }
    function activityListener() {
        // build registration activities and total cost
        $('.activities :checkbox').change(function(e) {

            $("#totCost").remove();   // remove for later appending of changed value
            //  get activity, potential conflict of this checkbox
            var activity = '';
            var conflict = '';
            if ( e.target.parentElement.id.indexOf("|") !=-1 ) {
                activity = e.target.parentElement.id.split("|")[0];
                conflict = e.target.parentElement.id.split("|")[1];
            } else {
                activity = e.target.parentElement.id;
            }
            //
            //  Note to self: within the context of a checkbox.change function
            //      'this.checked' seems to use the state of the checkbox to infer the event of 'checking'
            //      'else' seems to use the state of the checkbox to infer the event of 'unchecking'
            //      it is a subtle difference (state/event) and I wonder if there are implications
            //      in a scenario of just testing the state without an event? (something to research)
            //
            console.log ("Activity "+activity+" Conflict '"+conflict+"'");
            // this will contain a reference to the checkbox
            console.log ("this.checked "+this.checked);
            if (this.checked) {
                // the checkbox is now checked - increase totalCost
                totalCost += parseInt((e.target.parentElement.innerText).split("$")[1]);

                //  with conflict, disable conflicting activity
                if (activity == "Tue:am" || activity == "Tue:pm") {
                    // then do stuff to each of the other check boxes
                    $(".activities > label").each (function() {
                        // check to see if they are registered for conflicting workshop as well
                        if ($(this).find("input").attr("id") == (activity+"|"+conflict)) {
                            //disable other check boxes of the same type
                            $(this).find("input:not(:checked)").prop('disabled', 'disabled');
                            // append some text to the unchecked boxes of the same type showing that the morning has been booked
                            $(this).find("input:not(:checked)").parent().append('<small id="conflict"><em> '+activity+' Booked Already<em></small>');
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
                        // check to see if they registered for conflicting workshop as well
                        if ($(this).find("input").attr("id") == (activity+"|"+conflict)) {
                            //enable other check boxes of the same type
                            $(this).find("input:not(:checked)").removeAttr('disabled');
                            // remove the conflicting booking message
                            $(this).find('#conflict').remove();

                        }
                    });
                }
            }
        });
        console.log("Bottom");
        $('#fieldset-2').append("<div id='totCost'><label for='totalCost'>Total Registration Cost: $"+totalCost+"</label></div>");     //  reapply totalCost

    }
    //  End of functions
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
    //  Index the labels to make it easier to access
    //  identify potential scheduling conflicts - Tuesdays am & pm


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


    //  fieldset 3 - Payment
    //  Payment Information
    //      Options - Mutually exclusive (Fields dynamic based on choice)
    //          Credit Card
    //          PayPal
    //          Bitcoin
    //

    //  Validation Rules
    //      Name field is populated
    //      Email is populated and correctly formatted xxx@xxx.xxx
    //      At least one Activity is selected
    //      A payment option must be selected
    //          if credit card - must have 16 digit number, zip code, and CVV
    //

    titleListener();
    designListener();
    activityListener();

}());