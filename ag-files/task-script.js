console.log('test');
blocks = SpriteMorph.prototype.blocks;
// console.log(blocks);
// function myFunction(item) {
//     // arr[index] = item * document.getElementById("multiplyWith").value;
//     // demo.innerHTML = numbers;
//     arr.push(item.spec);
// }




function saveScript(event) {
    arr = [];
    blockarr = [];
    for (var property in blocks) {
        if (blocks.hasOwnProperty(property)) {
            arr.push(blocks[property].spec);
            blockarr.push(property);
        }
    }
    script = [];
    scriptsOnScreen = getScripts(0);
    json_scripts = JSONscript(scriptsOnScreen[0]);
    arr.forEach(function(blockspec) {
        if(scriptContainsBlock(json_scripts, blockspec)){
            script.push(blockspec);
        }
    });
    blockscript = [];
    blockarr.forEach(function(property) {
        if(scriptContainsBlock(json_scripts, blocks[property].spec)){
            blockscript.push(property);
        }
    });


    console.log(script);
    var jsonscript = JSON.stringify(script);
    var blockarray = JSON.stringify(blockscript);
    console.log('jsonscript:', jsonscript);
    // var el = document.createElement('script');
    // el.setAttribute('src', '?correctscript=' + script);
    // document.body.appendChild(el);
    //$(document).on("change", "#savescript_button", function() {
        $.ajax({
            url: "testscripts",
            type: "POST",
            data: {"scriptarray" : jsonscript, "blockarray": blockarray},
            dataType: "json",
            success: function(data) {
                console.log(data);
                $('#left').show();
                alert('successfully saved the scriptarray: ' + jsonscript + blockarray + '. Please press the tasks button to go back to main menu');
            }
        }).fail(function(error){
            console.log(error);
            alert('failed because there is already an existing record');
        }
        ).done(function() {
            // alert('done');
        });



}




