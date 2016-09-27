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
    //  End of Global Variables
    //**************************************************************************

    //  Set focus on Name field
    $("#name").focus();

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
    //      Main Conference - Mandatory             $200
    //      Workshops Optional
    //          JS Frameworks WS - Tue 9am-12pm     $100    (Conflicts w/Express)
    //          JS Libraries WS  - Tue 1pm-4pm      $100    (Conflicts w/Node.js)
    //          Express WS       - Tue 9am-12pm     $100    (Conflicts w/JS Frameworks)
    //          Node.js WS       - Tue 1pm-4pm      $100    (Conflicts w/JS Libraries)
    //          Build Tools WS   - Wed 9am-12pm     $100
    //          npm WS           - Wed 1pm-4pm      $100
    //  Index the labels to make it easier to access

    $(".activities > label").each(function() {
        var text = $(this).text();
        debugger;
        switch(text) {
            case (text.indexOf("Tuesday 9") >= 0):
                $(this).attr("id", "tue-am");
                break;
            case (text.indexOf("Tuesday 1") >= 0):
                $(this).attr("id", "tue-pm");
                break;
            case (text.indexOf("Wednesday 9") >= 0):
                $(this).attr("id", "wed-am");
                break;
            case (text.indexOf("Wednesday 1") >= 0):
                $(this).attr("id", "wed-pm");
                break;
            default:
                $(this).attr("id", "main");
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

}());