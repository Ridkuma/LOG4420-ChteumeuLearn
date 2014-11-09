$(document).ready(loadSite);

function loadSite() {
    var url = window.location.pathname.split("/");
    var location = url[url.length-1];

    // On dashboard
    if (location.indexOf('dashboard') != -1 || location.indexOf('getNumQuestions') != -1) {
        updateDetails();
        updateAside();
        sessionStorage.rightAnswersExam = 0;
        sessionStorage.totalQuestionExam=0;
    	if(location.indexOf('getNumQuestions') != -1){
    		putSelectedOptions();

    	}
    	sessionStorage.questionCount = 0;
        $("#domainSelect").focusout(onDomainSelectChanged);
        $("#questionCount").change(onQuestionCountChanged);
        $('#finalTestButton').click(function(){
            if(localStorage.examsDone==undefined){
                localStorage.examsDone=0;
            }
            var sum = parseInt(localStorage.examsDone);
            sum = sum+1;
            localStorage.examsDone=sum;
            });
        $('#resetStats').click(resetStats);
    } 
    // On exam
    else if(location.indexOf('questionExam') != -1) {
        checkNewQuestion();
        checkAnswer();
        updateStats();
    }
    // On quick test
    else if(location.indexOf('questionTest') != -1){
    
    }
    // On results
    else if (location.indexOf('results') != -1) {
        updateFinalResult();
    }
};

// Updates Details modal content table
function updateDetails() {
    if (localStorage.results == "" || localStorage.results == undefined) {
        return;
    }
    var table = $("#details #detailsTable");
    var results = JSON.parse(localStorage.results);
    for (var i =0; i<results.length; i++) {
        var $row = $("<tr/>").appendTo(table);
        $row.append("<td>" + (i + 1) + "</td>");
        $row.append("<td>" + results[i] + "</td>");
        var domains = JSON.parse(localStorage.domains);
        $row.append("<td>" + domains[i] + "</td>");
        
        
    };
}

function resetStats(){
    localStorage.examsDone =0;
    localStorage.domains="";
    localStorage.results="";
    window.location.reload();
}

function updateAside(){
    if(localStorage.examsDone != undefined){
        $('#examCount').text(localStorage.examsDone);
    }
    else{
    }
}

//On maintient les options selectionnées
function putSelectedOptions(){
		var str=[];
		str = JSON.parse(sessionStorage.options);
		console.log(str);
		for(var i = 0; i<str.length; i++){
			$('.selectOptions').each(function(){
				if(str[i] == $(this).text()){
					$(this).attr('selected','selected');
				}
			})
		}
};

// On domain selection change
function onDomainSelectChanged(){
    changeDomain();
};

// Get all questions available for current domains choice
function changeDomain() {
	getSelected();
    $('.getExam').attr('action','/getNumQuestions');
    $('.getExam').submit();
};

// Get selected options for question domain
function getSelected(){
    var str = [];
    $('#domainSelect option:selected').each(function(){
        str.push($(this).text());       
    })
    sessionStorage.options = JSON.stringify(str);
};

// On question count slider change
function onQuestionCountChanged() {
    getQuestionCount( $(this) );
    $("#finalTestButton").attr("disabled", false);
};

// Store question count choice, update text
function getQuestionCount(qCount){
    sessionStorage.questionCount = qCount.val();
    $('#selectedQuestionCount').text(qCount.val());
};

// Sets question count back to 0
function resetQuestionCount() {
    $("#questionCount").val($("#questionCount").attr('min'));
    getQuestionCount($("#questionCount"));
};

function checkNewQuestion(){
    if(sessionStorage.newQuestion == undefined || sessionStorage.newQuestion=='yes'){
        sessionStorage.newQuestion = 'yes';
        var total = parseInt(sessionStorage.totalQuestionExam);
        total = total+1;
        sessionStorage.totalQuestionExam=total;
        sessionStorage.newQuestion = 'no';
    }
    else{}
}

function checkAnswer(){
    if($('.answer').attr('data-correct') == "correct"){
        var right = parseInt(sessionStorage.rightAnswersExam);
        right = right+1;
        sessionStorage.rightAnswersExam=right;
        sessionStorage.newQuestion = 'yes';
    }
    if($('.answer').attr('data-correct') == "incorrect"){
        sessionStorage.newQuestion = 'yes';
    }
}

function updateFinalResult(){
    if(localStorage.results == undefined || localStorage.results=="" ){
        var result = sessionStorage.rightAnswersExam +"/"+sessionStorage.totalQuestionExam;
        var array = [];
        array.push(result);
        localStorage.results=JSON.stringify(array);
        var domains=[];
        var actualDomain = [];
        actualDomain = JSON.parse(sessionStorage.options);
        domains.push(actualDomain);
        localStorage.domains= JSON.stringify(domains);
    }
    else{
        var domains =[];
        domain=JSON.parse(sessionStorage.options);
        var array2 = JSON.parse(localStorage.domains);
        array2.push(domain);
        localStorage.domains=JSON.stringify(array2);
        var result = sessionStorage.rightAnswersExam +"/"+sessionStorage.totalQuestionExam;
        var array = JSON.parse(localStorage.results);
        array.push(result);
        localStorage.results=JSON.stringify(array);
    }
    var percent = (parseInt(sessionStorage.rightAnswersExam)/parseInt(sessionStorage.totalQuestionExam))*100;
    var message = ""
    if(percent < 25){
        message = "Il faut étudier beaucoup plus !";    
    }
    if(percent >= 25 && percent < 50){
        message = "Presque à la moyenne, un peu plus d'effort !";    
    }
    if(percent >= 50 && percent < 75){
        message = "Sur la moyenne, bon travail mais tu peux améliorer !";    
    }
    if(percent >= 75){
        message = "Super ! Continue comme ça !";    
    }
    $("#finalResult").text("Note Finale: " + percent + "%." );
    $("#finalResult").append("<br/>" + message);
};

function updateStats(){
    $('#examCount').text(localStorage.examsDone);
    $("#testStats").text("Note courante Examen : "+ sessionStorage.rightAnswersExam + "/" + sessionStorage.totalQuestionExam);  
    $('.questionNumber').text("Question: " + sessionStorage.totalQuestionExam + "/" + sessionStorage.questionCount);
}
