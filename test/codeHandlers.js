// Globals
var check_function=function() {return false;};
var problem_index=-1;
var outputMode='text';
var mysteryString='Aardvarks love ants';
var recordedTeamName='';
var session=Date.now()+'_'+uid;
        
function checkMatch() {
	return document.getElementById('output_body').innerHTML.replace('\n','<br>')==window.problems[problem_index].expected_output;
}

function checkGrid() { 
	for(var r=0; r<5; r++)
		for(var c=0; c<5; c++)
			if(document.getElementById('cell_'+r+'_'+c).style.backgroundColor!=document.getElementById('expectedcell_'+r+'_'+c).style.backgroundColor)
				return false;
	
	return true;
}

function run() {    
    if(outputMode=='text')
        document.getElementById('output_body').innerHTML='';
    else if(outputMode=='grid')
	document.getElementById('output_body').innerHTML=makeBlankGrid(5);
    else {
            // remove last span if there is one
            if(document.getElementById('output_body').children.length>0 && document.getElementById('output_body').children[document.getElementById('output_body').children.length-1].tagName=="SPAN")
                    document.getElementById('output_body').removeChild(document.getElementById('output_body').children[document.getElementById('output_body').children.length-1]);
    }
          
    try {
            eval(editor.getValue());
    } catch(e) {
            document.getElementById('output_body').innerHTML+='<br><span class="error">Parsing error in code.</span>';
    }

        // hack for #10
        var passed=false;
        if(problem_index==9) {
                try {
                        if( sum(1,1)==2 &&
                            sum(1,2)==3 &&
                            sum(2,4)==6 &&
                            sum(10,10)==20 &&
                            sum(123,456)==579 ) {
                            passed=true;                             
                            console.log('Function succeeded!');
                        } else
                            console.log('Function did not perform as specified');
                } catch(e) {
                        console.log('Error in function');
                }
        }
    if(passed || check_function()) {
        document.getElementById('icon').src='images/checkmark.gif';
        //document.getElementById('output_body').style.backgroundColor='#78b348';
        //document.getElementById('expected_body').style.backgroundColor='#78b348';
        
        $('#successModal').modal('show');
        recordData(true);
    } else {
        document.getElementById('icon').src='images/incorrect.gif';
        document.getElementById('output_body').style.backgroundColor='#fff';
        document.getElementById('expected_body').style.backgroundColor='#fff';
        recordData(false);
    }
    
    // setup single ball
        if(animateSingleBall) {
                balls=[];
                if(typeof(window.ball.movement)=='boolean' && window.ball.movement)
                        balls.push(new Ball(100, 100, window.ball.speed, window.ball.speed, 20, window.ball.color));
                else
                        balls.push(new Ball(100, 100, 0, 0, 20, window.ball.color));
        }
}

function recordData(passed) {
	code=encodeURIComponent(editor.getValue());
	
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            lastResponse = this.responseText;
       }
    };
	xhttp.open("POST", "record.php", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	data=  "team="+recordedTeamName;
	data+="&problem="+(problem_index+1);
	data+="&code="+code;
	data+="&fingerprint="+uid;
	data+="&session="+session;
        data+="&passed="+passed;
	xhttp.send(data);
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

function makeBlankGrid(size, prefix) {
    if(prefix === undefined)
            prefix='';
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

function makeBlue(r,c,prefix){
    if(prefix === undefined)
            prefix='';
    document.getElementById(prefix+'cell_'+r+'_'+c).style.backgroundColor='#007bff';
}

function makeRed(r,c,prefix){
    if(prefix === undefined)
            prefix='';
    document.getElementById(prefix+'cell_'+r+'_'+c).style.backgroundColor='#ff0000';
}

function isColor(r,c,color) {
    return document.getElementById('cell_'+r+'_'+c).style.backgroundColor==color;
}

var disabledProblems=[];
function loadProblem(num) {
    animateSingleBall=false;
    mirrorExpected=false;
    
    if (num >= 0 && num < problems.length && disabledProblems.indexOf(num)==-1) {
        clearBallPit();
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

        check_function=problem.check_function;
        
        if(problem.setup_function)
            problem.setup_function();
        
        document.getElementById('icon').src='images/placeholder.png';
        document.getElementById('output_body').style.backgroundColor='#fff';
        document.getElementById('expected_body').style.backgroundColor='#fff';

        if(outputMode=='text') {
            document.getElementById('output_body').style.textAlign='left';
            document.getElementById('expected_body').style.textAlign='left';
        } else if(outputMode=='balls') {
            initCanvas();
            document.getElementById('output_body').style.textAlign='left';
            document.getElementById('expected_body').style.textAlign='left';
        } else {
            document.getElementById('output_body').style.textAlign='center';
            document.getElementById('output_body').style.justifyContent='center';
            document.getElementById('expected_body').style.textAlign='center';
        }
        
        // hack block things
	if(num==3 || num==4 || num==6 || num==8 || num==9) {
		document.getElementById('blocker').style.display='block';
	} else {
		document.getElementById('blocker').style.display='none';
	}
    }
}

function displaySolution(){
    editor.setValue("");
    var customPosition = {
        row: 0,
        column: 0
    };
    editor.session.insert(customPosition, problem.solution);
}

function isSpecial(num){
    if(num==3 || num==4 || num==6 || num==7 || num ==9)
        return true;
    return false;
}

function submit(){
    $('#problem'+problem_index).removeClass('active show');
    $('#problem'+problem_index).addClass('disabled');
    disabledProblems.push(problem_index);
    $('#problem'+(problem_index+1)).addClass('active show');
    $('#successModal').modal('hide');
    loadProblem(problem_index+1);
}


preColors=['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
colors=[];
for(let i=0; i<preColors.length; i++)
	colors.push('<span style="font-weight: bold; color: '+preColors[i]+'">'+preColors[i]+'</span>');

preShapes=['square', 'oval', 'triangle', 'trapezoid', 'parallelogram'];
shapes=[];
for(let i=0; i<preShapes.length; i++)
	shapes.push('<div class="'+preShapes[i]+'"></div>');

