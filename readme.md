In this project, you'll create an interactive registration form for "FullStack Conf". Using the supplied HTML and CSS files, you'll use JavaScript to enhance the form by adding interactivity. You can use plain JavaScript or jQuery –– it's up to you!

This project is a great way for you to practice fundamental JavaScript skills. It also gives you a simple interactive portfolio project you can use to show off your understanding of JavaScript. Forms are a large part of any web application, so learning how to make them easy-to-use, interactive and responsive is a task you should master.

<strong>1. Create and link a JavaScript file to index.html</strong>

    Create a JavaScript file inside the "js" folder and link it to index.html
    If you're using jQuery, link index.html to the latest version of jQuery

<strong>2. Set focus on the first text field</strong>

    When the page loads, give focus to the first text field ( name field)

<strong>3. Job Role section of the form. Reveal a text field when the "Other" option is selected from the "Job Role" drop down menu</strong>
    Make sure you add an text input field.
    Use the id of "other-title" for the field
    Add placeholder text of "Your Title" for the field

<strong>4. T-Shirt Info section of the form. For the T-Shirt color menu, only display the options that match the design selected in the "Design" menu.</strong>

    If the user selects "Theme - JS Puns" then the color menu should only display "Cornflower Blue," "Dark Slate Grey," and "Gold."
    If the user selects "Theme - I ♥ JS" then the color menu should only display "Tomato," "Steel Blue," and "Dim Grey."

<strong>5. Register for Activities section of the form.</strong>

    Some events are at the same time as others. If the user selects a workshop, don't allow selection of a workshop at the same date and time -- you should disable the checkbox and visually indicate that the workshop in the competing time slot isn't available.
    When a user unchecks an activity, make sure that competing activities (if there are any) are no longer disabled.
    As a user selects activities to register for, a running total is listed below the list of checkboxes. For example, if the user selects "Main conference" then Total: $200 should appear. If they add 1 workshop the total should change to Total: $300.

<strong>6. Payment Info section of the form. Display payment sections based on chosen payment option</strong>

    The"Credit Card" payment option should be selected by default and result in the display of the #credit-card div, and hide the "Paypal" and "Bitcoin information.
    When a user selects the "PayPal" payment option, display the Paypal information, and hide the credit card information and the "Bitcoin" information.
    When a user selects the "Bitcoin" payment option, display the Bitcoin information, and hide the credit card information.

<strong>7. Form validation. Display error messages and don't let the user submit the form if any of these validation errors exist:</strong>

    Name field can't be empty
    Email field must be a validly formatted e-mail address (you don't have to check that it's a real e-mail address, just that it's formatted like one: dave@teamtreehouse.com for example. You'll need to use a regular expression to get this requirement. See the list of Resources for links to learn about regular expressions.
    At least one activity must be checked from the list under "Register for Actitivities."
    Payment option must be selected.
    If "Credit card" is the selected payment option, make sure the user supplied a credit card number, a zip code, and a 3 number CVV value.
    
<strong>8. NOTE: Cross Browser Check</strong>

    A good practice is to check your project for cross browser compatibility. Making sure that it looks and functions correctly in multiple (at least three) browsers is an important part of being a top-notch developer. If you want, leave a comment to the project reviewer about which browser(s) the project was checked to ensure they are seeing things as you have designed them.
    Some browser options:
        Google Chrome
        Mozilla Firefox
        Internet Explorer/Edge
        Safari

<strong>9. Extra Credit</strong>

To get an "exceeds" rating, you can expand on the project in the following ways:

    3 steps
    
        Hide the "Color" label and select menu until a T-Shirt design is selected from the "Design" menu.
        
        Style the "select" menus (drop down menus) on the form, so they match the styling of the text fields (see Resources links for an article on how to improve the look of select menus using CSS and JavaScript).
        
        Validate the credit card number so that it's a validly formatted credit card number. (see the Resources links for information on how to do this.)
