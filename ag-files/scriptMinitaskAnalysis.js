function NumberCBlockContainsInSprite(block1Spec, block2Spec,block2Spec_num, spriteIndex, argArray1, argArray2, softMatch) {
    // Populate optional parameters
    if (spriteIndex === undefined) {
        spriteIndex = 0;
    }
    if (softMatch === undefined) {
        softMatch = false;
    }
    try {
        var JSONtarget;
        var doesContain;
        var scriptsOnScreen = getScripts(spriteIndex);
        for (var i = 0; i < scriptsOnScreen.length; i++) {
            JSONtarget = JSONscript(scriptsOnScreen[i]);
            doesContain = NumberCBlockContains(block1Spec, block2Spec, block2Spec_num, JSONtarget, argArray1, argArray2, softMatch);
            if (doesContain) {
                return true;
            }
        }
    } catch(e) {
        return false;
    }
    return false;
}

function NumberCBlockContains(block1Spec, block2Spec,block2Spec_num, script, argArray1, argArray2, softMatch) {
    console.log('scriptminitaskanalysis');
    // TODO: Fix this condition
    if (Object.prototype.toString.call(script) !== '[object Array]') {
        return false;
    }
    if (argArray1 === undefined) {
        argArray1 = [];
    }
    if (argArray2 === undefined) {
        argArray2 = [];
    }
    if (softMatch === undefined) {
        softMatch = false;
    }
    var morph1, type1, CblockSpecs;
    // TODO: Replace this with one list.
    // TODO: Write a function to find with inputs.
    CblockSpecs = ["repeat %n %loop","repeat %n %c", "warp %c", "forever %c", "for %upvar = %n to %n %cs"];
    CblockSpecs = CblockSpecs.concat(["repeat until %b %c", "if %b %c", "if %b %c else %c"]);
    CblockSpecs = CblockSpecs.concat(["for each %upvar of %l %cs"]);

    // Added the below for loop to make checking for valid blockSpecs more robust using blockSpecMatch()
    var foundSpec = false;
    for (var i = 0; i < CblockSpecs.length; i++) {
        if (blockSpecMatch(CblockSpecs[i], block2Spec)) {
            foundSpec = true;
            break;
        }
    }

    if (!foundSpec) { return false; }


    var count = 0;
    for (var i = 0; i < script.length; i++) {
        morph1 = script[i];
        type1 = typeof(morph1);
        if ((type1 === "string")) {
            continue;
        } else if (Object.prototype.toString.call(morph1) === '[object Array]') {
            console.log("(Object.prototype.toString.call(morph1) === '[object Array]')");
            if (CBlockContains(block1Spec, block2Spec, morph1, argArray1, argArray2, softMatch)) {
                return true;
            }
        } else if (blockSpecMatch(morph1.blockSp, block2Spec) && checkArgArrays(argArray2, morph1.inputs)) {
            count += 1;
            console.log("count: ", count);
            if(count === block2Spec_num) {
                if (scriptContainsBlock(morph1.inputs[morph1.inputs.length - 1], block1Spec, argArray1, softMatch)) {
                    console.log("count === block2specnum");
                    return true;
                }
                break;
            }

            if ((morph1.blockSp === "if %b %c else %c")
                && (scriptContainsBlock(morph1.inputs[morph1.inputs.length - 2], block1Spec, argArray1, softMatch))) {
                return true;
            }
        }

         // else if (CblockSpecs.indexOf(morph1.blockSp) >= 0) {
        //     if (CBlockContains(block1Spec, block2Spec, morph1.inputs[morph1.inputs.length - 1], argArray1, argArray2, softMatch)) {
        //         return true;
        //     }
        //     if ((morph1.blockSp === "if %b %c else %c")
        //         && (CBlockContains(block1Spec, block2Spec, morph1.inputs[morph1.inputs.length - 2], argArray1, argArray2, softMatch))) {
        //         return true;
        //     }
        // }
    }
    return false;
}

function blockPrecedesInRepeat(block1, block2, repeat_num, script, index, seen1) {
    if (script === undefined) {
        if (index === undefined) {
            index = 0;
        }
        scriptsOnScreen = getScripts(0);
        script = scriptsOnScreen[index];
        var script = JSONscript(script);
    }
    if (Object.prototype.toString.call(script) !== '[object Array]') {
        return false;
    }
    if (seen1 === undefined) {
        seen1 = false;
    }
    var count = 0;
    var subscript = {};
    for (var i = 0; i < script.length; i++) {
        morph1 = script[i];
        type1 = typeof(morph1);
        if ((type1 === "string")) {
            continue;
        }  else if (blockSpecMatch(morph1.blockSp, "repeat %n %loop")) {
            count += 1;
            console.log("count: ", count);
            if(count === repeat_num) {
                // if (scriptContainsBlock(morph1.inputs[morph1.inputs.length - 1], block1Spec, argArray1, softMatch)) {
                console.log("count === block2specnum");
                var subscript = morph1.inputs[morph1.inputs.length - 1];
                // }
                break;
            }

        }

    }


    if (subscript ==={}){
        return false;
    }
    var submorph1, type1;
    for (var i = 0; i < subscript.length; i++) {
        submorph1 = subscript[i];
        type1 = typeof(submorph1);

        if ((type1 === "string")) {
            continue;
        } else if (Object.prototype.toString.call(submorph1) === '[object Array]') {
            if (blockPrecedes(block1, block2, submorph1, seen1)) {
                return true;
            }
        } else {
            if (blockSpecMatch(submorph1.blockSp, block2)) {
                console.log("blockSpecMatch(submorph1.blockSp, block2)",  block2);
                if (!seen1) {
                    return false;
                }
                return true;
            }
            if (blockSpecMatch(submorph1.blockSp, block1)) {
                console.log("blockSpecMatch(submorph1.blockSp, block1)",  block1);
                seen1 = true;
            }
            // if (blockPrecedesInRepeat(block1, block2, repeat_num, submorph1.inputs, seen1)) {
            //     return true;
            // }

        }
    }

    return false;
}

function occurancesOfBlockSpecInRepeat(blockSpec, repeat_num) {


    scriptsOnScreen = getScripts(0);
    script = scriptsOnScreen[0];
    var script = JSONscript(script);

    var count = 0;
    var subscript = {};
    for (var i = 0; i < script.length; i++) {
        morph1 = script[i];
        type1 = typeof(morph1);
        if ((type1 === "string")) {
            continue;
        }  else if (blockSpecMatch(morph1.blockSp, "repeat %n %loop")) {
            count += 1;
            console.log("count: ", count);
            if(count === repeat_num) {
                // if (scriptContainsBlock(morph1.inputs[morph1.inputs.length - 1], block1Spec, argArray1, softMatch)) {
                console.log("count === block2specnum");
                var subscript = morph1.inputs[morph1.inputs.length - 1];
                // }
                break;
            }

        }

    }
    if (subscript ==={}){
        return false;
    }

    var submorph1, type1;
    var result = 0;
    for (var i = 0; i < subscript.length; i++) {
        submorph1 = subscript[i];
        type1 = typeof(submorph1);

        if ((type1 === "string")) {
            continue;
        } else {
            if (blockSpecMatch(submorph1.blockSp, blockSpec)) {
                result += 1;
            }
        }
    }

    return result;
}

function checkBelong(block_array, spec_array) {
    if (spec_array.length === 0) {
        return true;
    }
    if (block_array.length === 0) {
        return false;
    }

    if (blockSpecMatch(block_array[0].blockSp, spec_array[0])) {
        return checkBelong(block_array.slice(1), spec_array.slice(1));
    }
    else{
        return checkBelong(block_array.slice(1), spec_array);
    }
    // }


}


function SeriesOfBlockSpecInRepeat(spec_array, repeat_num) {



    scriptsOnScreen = getScripts(0);
    script = scriptsOnScreen[0];
    var script = JSONscript(script);

    var count = 0;
    var subscript = {};
    for (var i = 0; i < script.length; i++) {
        morph1 = script[i];
        type1 = typeof(morph1);
        if ((type1 === "string")) {
            continue;
        }  else if (blockSpecMatch(morph1.blockSp, "repeat %n %loop")) {
            count += 1;
            console.log("count: ", count);
            if(count === repeat_num) {
                // if (scriptContainsBlock(morph1.inputs[morph1.inputs.length - 1], block1Spec, argArray1, softMatch)) {
                console.log("count === block2specnum");
                var subscript = morph1.inputs[morph1.inputs.length - 1];
                // }
                break;
            }

        }

    }
    if (subscript ==={}){
        return false;
    }

    if(checkBelong(subscript, spec_array) === true){
        return true;
    }
    else{
        return false;
    };
    // return result;
}


function checkBelongInSprite(block_array, spec_array) {
    if (spec_array.length === 0) {
        return true;
    }
    if (block_array.length === 0) {
        return false;
    }

    if (blockSpecMatch(block_array[0].blockSpec, spec_array[0])) {
        return checkBelongInSprite(block_array.slice(1), spec_array.slice(1));
    }
    else{
        return checkBelongInSprite(block_array.slice(1), spec_array);
    }
    // }


}



function SeriesOfBlockSpecInSprite(spec_array){

    scriptsOnScreen = getScripts(0);
    script = scriptsOnScreen[0];

    var blocksequence = script.blockSequence();
    // blocksequence = JSONscript(blocksequence);

    return checkBelongInSprite(blocksequence, spec_array);
}

function SeriesOfBlockSpecInOuterRepeat(spec_array){
    scriptsOnScreen = getScripts(0);
    script = scriptsOnScreen[0];
    var script = JSONscript(script);

    var subscript = {};
    for (var i = 0; i < script.length; i++) {
        morph1 = script[i];
        type1 = typeof(morph1);
        if ((type1 === "string")) {
            continue;
        }  else if (blockSpecMatch(morph1.blockSp, "repeat %n %loop")) {

                // if (scriptContainsBlock(morph1.inputs[morph1.inputs.length - 1], block1Spec, argArray1, softMatch)) {
                console.log("count === block2specnum");
                var subscript = morph1.inputs[morph1.inputs.length - 1];
                // }
                break;

        }

    }
    if (subscript ==={}){
        return false;
    }
    return checkBelong(subscript, spec_array);
}


function SeriesOfBlockSpecInInnerRepeat(spec_array){
    scriptsOnScreen = getScripts(0);
    script = scriptsOnScreen[0];
    var script = JSONscript(script);

    var subscript = {};
    for (var i = 0; i < script.length; i++) {
        morph1 = script[i];
        type1 = typeof(morph1);
        if ((type1 === "string")) {
            continue;
        }  else if (blockSpecMatch(morph1.blockSp, "repeat %n %loop")) {

            // if (scriptContainsBlock(morph1.inputs[morph1.inputs.length - 1], block1Spec, argArray1, softMatch)) {
            console.log("count === block2specnum");
            var subscript = morph1.inputs[morph1.inputs.length - 1];
            // }
            break;

        }

    }
    if (subscript ==={}){
        return false;
    }

    var subsubscript = {};

    for (var i = 0; i < subscript.length; i++) {
        morph1 = subscript[i];
        type1 = typeof(morph1);
        if ((type1 === "string")) {
            continue;
        }  else if (blockSpecMatch(morph1.blockSp, "repeat %n %loop")) {

            // if (scriptContainsBlock(morph1.inputs[morph1.inputs.length - 1], block1Spec, argArray1, softMatch)) {
            var subsubscript = morph1.inputs[morph1.inputs.length - 1];
            // }
            break;

        }

    }

    return checkBelong(subsubscript, spec_array);
}




function IfExistsInInnerForever(ifblockinput){
    scriptsOnScreen = getScripts(0);
    script = scriptsOnScreen[0];
    var script = JSONscript(script);

    var subscript = {};
    for (var i = 0; i < script.length; i++) {
        morph1 = script[i];
        type1 = typeof(morph1);
        if ((type1 === "string")) {
            continue;
        }  else if (blockSpecMatch(morph1.blockSp, "forever %loop")) {
            console.log("count === block2specnum");
            var subscript = morph1.inputs[morph1.inputs.length - 1];
            // }
            break;
        }

    }
    if (subscript ==={}){
        return false;
    }

    var subsubscript = {};

    for (var i = 0; i < subscript.length; i++) {
        morph1 = subscript[i];
        type1 = typeof(morph1);
        if ((type1 === "string")) {
            continue;
        }  else if (blockSpecMatch(morph1.blockSp, "if %b %c")) {
            if (blockSpecMatch(morph1.inputs[0].blockSp, "key %key pressed?"){
                if(blockSpecMatch(morph1.inputs[0].inputs[0], ifblockinput)){
                    return true;
                }
            }


        }

    }

}





function IfDoExistsInInnerForever(ifblockinput, ifblockdo){
    scriptsOnScreen = getScripts(0);
    script = scriptsOnScreen[0];
    var script = JSONscript(script);

    var subscript = {};
    for (var i = 0; i < script.length; i++) {
        morph1 = script[i];
        type1 = typeof(morph1);
        if ((type1 === "string")) {
            continue;
        }  else if (blockSpecMatch(morph1.blockSp, "forever %loop")) {
            console.log("count === block2specnum");
            var subscript = morph1.inputs[morph1.inputs.length - 1];
            // }
            break;
        }

    }
    if (subscript ==={}){
        return false;
    }

    var subsubscript = {};

    for (var i = 0; i < subscript.length; i++) {
        morph1 = subscript[i];
        type1 = typeof(morph1);
        if ((type1 === "string")) {
            continue;
        }  else if (blockSpecMatch(morph1.blockSp, "if %b %c")) {
            if (blockSpecMatch(morph1.inputs[0].blockSp, "key %key pressed?"){
                if(blockSpecMatch(morph1.inputs[0].inputs[0], ifblockinput)){
                    if(blockSpecMatch(morph1.inputs[1][0].blockSp, ifblockdo)) {
                        return true;
                    }
                }
            }


        }

    }

}