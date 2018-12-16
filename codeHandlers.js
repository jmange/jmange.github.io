// Globals
var check_function=function() {return false;};
var problem_index=-1;
var outputMode='text';
        
function checkMatch() {
	return document.getElementById('output_body').innerHTML.replace('\n','<br>')==window.problems[problem_index].expected_output;
}

function checkGrid() { 
	for(var r=0; r<3; r++)
		for(var c=0; c<3; c++)
			if(document.getElementById('cell_'+r+'_'+c).style.backgroundColor!=document.getElementById('expectedcell_'+r+'_'+c).style.backgroundColor)
				return false;
	
	return true;
}

function run() {
    if(outputMode=='text')
        document.getElementById('output_body').innerHTML='';
    eval(editor.getValue());

    if(check_function()) {
        document.getElementById('icon').src='images/checkmark.gif';
        //document.getElementById('output_body').style.backgroundColor='#78b348';
        //document.getElementById('expected_body').style.backgroundColor='#78b348';
    } else {
        document.getElementById('icon').src='images/incorrect.gif';
        document.getElementById('output_body').style.backgroundColor='#fff';
        document.getElementById('expected_body').style.backgroundColor='#fff';
    }
}

// functions for the problems
function makeBoxBlue(){
    document.getElementById('output_box').style.backgroundColor='#007bff';
}

function makeBoxRed(){
    document.getElementById('output_box').style.backgroundColor='red';
}

function makeBallBlue(){
    document.getElementById('output_circle').style.backgroundColor='#007bff';
}

function makeBallRed(){
    document.getElementById('output_circle').style.backgroundColor='red';
}

function makeBlankGrid(size, prefix='') {
    var grid='<table id="table_'+size+'" border=1>';
    for(var r=0; r<size; r++) {
        grid+="<tr>";
        for(var c=0; c<size; c++)
            grid+='<td id="'+prefix+'cell_'+r+'_'+c+'">&nbsp;</td>';
        grid+="</tr>";
    }
    grid+="</table>";
    return grid;
}

function makeBlue(r,c,prefix=''){
    document.getElementById(prefix+'cell_'+r+'_'+c).style.backgroundColor='#007bff';
}

function isColor(r,c,color) {
    return document.getElementById('cell_'+r+'_'+c).style.backgroundColor==color;
}

function loadProblem(num) {
    if (num >= 0 && num < problems.length){
        editor.setValue("");
        problem=problems[num];
        problem_index=num;
        document.getElementById('instructions_body').innerHTML=problem.instructions;
        document.getElementById('expected_body').innerHTML=problem.expected_output;
        outputMode=problem.output_mode;
        document.getElementById('output_body').innerHTML='';
        if(problem.output)
            document.getElementById('output_body').innerHTML=problem.output;
        
        if(outputMode=='box' || outputMode=='box and circle')
            document.getElementById('output_box').style.backgroundColor='white';
        
        if(outputMode=='box and circle')
            document.getElementById('output_circle').style.backgroundColor='white';

        if(problem.setup_function)
            problem.setup_function();
        
        check_function=problem.check_function;
        document.getElementById('icon').src='images/placeholder.png';
        document.getElementById('output_body').style.backgroundColor='#fff';
        document.getElementById('expected_body').style.backgroundColor='#fff';

        if(outputMode!='text') {
            document.getElementById('output_body').style.textAlign='center';
            document.getElementById('output_body').style.justifyContent='center';
            document.getElementById('expected_body').style.textAlign='center';
        } else {
            document.getElementById('output_body').style.textAlign='left';
            document.getElementById('expected_body').style.textAlign='left';
        }
    }
}

function displaySolution(){
    editor.setValue("");
    var customPosition = {
        row: 0,
        column: 0
    }
    editor.session.insert(customPosition, problem.solution);
}
