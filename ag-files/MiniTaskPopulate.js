console.log('fang pi');
populateFeedback = function(feedbackLog, allFeedback, chunknum, tipnum) {
    // TODO: Declare move variables up here:
    var i, j, x;

    var comment = document.getElementById("comment");
    comment.innerHTML = "";

    while (comment.nextSibling) {
        document.getElementById("ag-results").removeChild(comment.nextSibling);
    }

    var log = feedbackLog;
    var chunks = log.chunk_list;
    var linebreak = document.createElement("br");
    var numtips = 0;
    var chunkHasCorrectTip = false;
    var tipHasCorrectTest = false;

    var tipsDiv = document.getElementById("numtips");

    ['correct', 'incorrect'].forEach(createCorrectIncorrectGrouping);


    var correct_total = 0;
    var incorrect_total = 0;
    var correct_feedbacks = [];
    var incorrect_feedbacks = [];
    for (i = 0; i < chunks.length; i++) {
        console.log("chunks.length", chunks.length);
        var chunk = chunks[i];

        var chunkPoints = "";
        if (showPoints) {
            chunkPoints = " ({0} possible {1}) ".format(
                chunk.totalPoints, pluralize('point', chunk.totalPoints));
        }

        var tips = chunk.tip_list;


        var header = document.createElement("p");
        header.innerHTML = chunk.chunk_title + chunkPoints + '<br><br>';

        header.classList.add("chunk-header", "chunk" + i);

        var correct_chunk = header.cloneNode(true);
        correct_chunk.classList.add("correct-chunk" + i);

        if (chunk.allCorrect) {
            document.getElementById("correct-section").style.display = "block";
            document.getElementById("correct-section").appendChild(correct_chunk);
        } else {
            var incorrect_chunk = header.cloneNode(true);
            incorrect_chunk.classList.add("incorrect-chunk" + i);
            document.getElementById("incorrect-section").style.display = "block";
            document.getElementById("incorrect-section").appendChild(incorrect_chunk);
        }

        var allFeedback = allFeedback !== undefined ? allFeedback : false;
        var currRank = 1;
        console.log("tips: ", tips);
        // tipLoop:
        // TODO: Document this

        // for (x = 0; x < tips.length; x++) {
        x = 0;
        console.log('x', x, 'tips.length', tips.length);
        var tip = tips[x];
        var label_class = "incorrectans";
        var div = document.createElement("div");
        var current_chunk = document.getElementsByClassName("incorrect-chunk" + i)[0];
        if (tip.allCorrect) {
            correct_total += 1;
            document.getElementById("correct-section").style.display = "block";
            document.getElementById("correct-section").appendChild(correct_chunk);
            current_chunk = document.getElementsByClassName("correct-chunk" + i)[0];
            label_class = "correctans";
            var suggestion = tip.complement;
        } else {
            incorrect_total += 1;
            numtips += 1;
            var suggestion = tip.suggestion;
        }

        var tipPoints = "";

        // TODO: Clean this up
        // TODO: Use a button and bootstrap collapse.
        div.innerHTML = '<input class="details" id="expander' + i + x + '" type="checkbox" ><label class="' + label_class + '" for="expander' + i + x + '">' + tipPoints + suggestion + '</label><div id="table-wrapper' + i + x + '">';

        current_chunk.appendChild(div);
        var details = document.getElementById("table-wrapper" + i + x);
        details.previousSibling.click();
        var allTests = tip.test_list;
        appendElement(
            "p",
            "",
            ["inner-titles", "observations" + i + x],
            details
        );
        j = 0;
        // for (j = 0; j < allTests.length; j++) {
        // console.log('alltests.length', allTests.length);
        var newRow = document.createElement("tr");
        var thisTest = allTests[j];
        var testPoints = showPoints ? "({0}) ".format(
            pluralizeWithNum('point', thisTest.points)
        ) : '';

        if (thisTest.testClass !== "r") {
            if (document.getElementsByClassName("observations-section" + i + x[0]) !== []) {
                incorrect_assertions = 0;
                correct_assertions = 0;
                appendElement(
                    "div",
                    "",
                    ["results", "observations-section" + i + x],
                    document.getElementsByClassName("observations" + i + x)[0]
                );
            }

            if (!tip.allCorrect && thisTest.correct) {
                tipHasCorrectTest = true;
                if (!document.getElementById("correct-tip" + i + x)) {
                    // TODO: What's this for?
                }
            }

            if (thisTest.correct) {
                correct_feedbacks.push(thisTest.feedback);
                correct_assertions += 1;
                // TODO: Consider removing this conditional and always showing the test.
                if (allFeedback || tip.allCorrect) {
                    appendElement(
                        "p",
                        "✔",
                        "data",
                        document.getElementsByClassName("observations-section" + i + x)[0]
                    );
                    appendElement(
                        "p",
                        testPoints + "Tests Passed! " + thisTest.feedback,
                        ["data", "assertion"],
                        document.getElementsByClassName("observations-section" + i + x)[0]
                    );
                    appendElement(
                        "br",
                        null,
                        null,
                        document.getElementsByClassName("observations-section" + i + x)[0]
                    );
                }
            } else {
                incorrect_feedbacks.push(thisTest.feedback);
                // Non-r class failing cases.
                appendElement(
                    "p",
                    "✖",
                    "data",
                    document.getElementsByClassName("observations-section" + i + x)[0]
                );
                incorrect_assertions += 1;
                appendElement(
                    "p",
                    testPoints + thisTest.feedback,
                    ["data", "assertion"],
                    document.getElementsByClassName("observations-section" + i + x)[0]
                );
                appendElement(
                    "br",
                    null,
                    null,
                    document.getElementsByClassName("observations-section" + i + x)[0]
                );
            }
        } else { // TESTS WITH CLASS 'r'
            if (document.getElementsByClassName("tests-section" + i + x[0]) !== []) {
                incorrect_tests = 0;
                correct_tests = 0;
                appendElement(
                    "div",
                    "",
                    ["results", "tests-section" + i + x],
                    document.getElementsByClassName("observations" + i + x)[0]
                );
            }
            if (thisTest.correct && !tip.allCorrect) {
                tipHasCorrectTest = true;
                if (!document.getElementById("correct-tip" + i + x)) {
                    // TODO: This?
                }
            }

            if (thisTest.correct) {
                correct_tests += 1;
            } else {
                incorrect_tests += 1;
            }

            var htmlString, string_reporter, testSectionDiv;

            string_reporter = document.createElement("div")
            string_reporter.classList.add("data", "assertion");

            // TODO: Try extracting this out.
            if (thisTest.correct) {
                // TODO: FIX THE CSS LIST HERE
                // passing-test-case is used for the show/hide button
                if (allFeedback || tip.allCorrect) {
                    appendElement(
                        "p",
                        "✔",
                        ["data", "passing-test-case"],
                        document.getElementsByClassName("tests-section" + i + x)[0]
                    );
                    // TODO Clean these strings up.
                    var input = thisTest.input;
                    if (input instanceof List || input instanceof Array) {
                        input = arrayFormattedString(input);
                    }

                    htmlString = [
                        '<p class="data assertion">',
                        testPoints + thisTest.feedback,
                        ' The input: <code class="data assertion">',
                        input,
                        '</code>'
                    ].join('');
                    if (thisTest.expOut.constructor !== Function) {
                        var expOut = thisTest.expOut;
                        if (expOut instanceof List || expOut instanceof Array) {
                            expOut = arrayFormattedString(expOut);
                        }
                        htmlString += [
                            '<p class="data assertion">, returned the',
                            ' expected value: <code class="data assertion">',
                            expOut,
                            '</code></p>'
                        ].join('');
                    } else {
                        htmlString += '<p class="data assertion">passed the tests.</p>';
                    }
                    // TODO: Make a block ==> image call here!
                    string_reporter.innerHTML = htmlString;
                    // TODO: Clean up this...
                    document.getElementsByClassName(
                        "tests-section" + i + x
                    )[0].appendChild(string_reporter);
                    appendElement(
                        "br",
                        null,
                        null,
                        document.getElementsByClassName("tests-section" + i + x)[0]
                    );
                }
            } else {
                appendElement(
                    "p",
                    "✖",
                    "data",
                    document.getElementsByClassName("tests-section" + i + x)[0]
                );

                string_reporter.classList.add("data", "assertion");
                // TODO Clean these strings up.
                var input = thisTest.input;
                if (input instanceof List || input instanceof Array) {
                    input = arrayFormattedString(input);
                }

                htmlString = [
                    '<p class="data assertion">',
                    testPoints + thisTest.feedback,
                    'The input: <code>',
                    input,
                    '</code></p> '
                ].join('');

                // Don't show "expected output" if the output check is
                // a custon JS function (where no output type is known.)
                if (thisTest.expOut && thisTest.expOut.constructor !== Function) {
                    var expOut = thisTest.expOut;
                    if (expOut instanceof List || expOut instanceof Array) {
                        expOut = arrayFormattedString(expOut);
                    }
                    htmlString += [
                        '<p class="data assertion">did <em>not</em> return the',
                        ' expected value: ',
                        '<code>', expOut, '</code></p>'
                    ].join('');
                }
                if (thisTest.output === null) {
                    htmlString += [
                        '<p class="data assertion"> did <em>not</em> return the expected value.</p>',
                        ''
                    ].join('');
                    htmlString += '<p class="data assertion"> Instead it returned no output.</p>';
                } else {
                    var output = thisTest.output;
                    if (output instanceof List || output instanceof Array) {
                        output = arrayFormattedString(output);
                    }
                    htmlString += '<p class="data assertion">output: <code>' + output + '</code></p>';
                }
                string_reporter.innerHTML = htmlString;
                document.getElementsByClassName(
                    "tests-section" + i + x
                )[0].appendChild(string_reporter);

                appendElement(
                    "br",
                    null,
                    null,
                    document.getElementsByClassName("tests-section" + i + x)[0]
                );
            } // 'r' test cases
        } // end adding test div

        if (tip.rank === currRank || tip.rank !== 0) {
            // TODO: document this....
            if (!tip.allCorrect) {
                // break tipLoop;
            } else {
                currRank += 1;
            }
        }
    }
    console.log('correct_total', correct_total);
    console.log('incorrect_total', incorrect_total);
    console.log('correct_feedback', correct_feedbacks);
    console.log('incorrect_feedback', incorrect_feedbacks);


    stars = document.createElement('div');
    stars.className = ('container');
    stars.id = 'stars';
    star = $('<div>')
        .html("<%= escape_javascript image_tag('star.jpg') %> <p>text<p> <p class = 'description'> description <p>").addClass('star');
    // star.id = 'star';
    // star.html("<p>text<\p>");
    // star.className = 'star';
    unstar = $('<div>')
        .html("<%= escape_javascript image_tag('unstar.jpg') %>").addClass('star');
    // unstar.className = 'unstar';
    if (numtips == 0) {
        divTest = $('<div>')
            .html("<%= escape_javascript button_to('Next Subtask',  minitask_path(@nextminitask), {class: 'nextminitask'}) %>")
        ;
        $("#ag-results").append(divTest);

    }
    $("#ag-results").append(stars);
    $("#stars").append(star);
    $("#stars").append(unstar);
    // TODO Make a function for this.
    tipsDiv.innerHTML = '<span class="badge">{0}</span>'.format(numtips) + pluralize('tip', numtips);

    if (tipHasCorrectTest) {
        $(SELECT.toggle_correct_button).show();
    }

    openResults();
};