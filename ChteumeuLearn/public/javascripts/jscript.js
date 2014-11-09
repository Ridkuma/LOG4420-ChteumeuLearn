$(document).ready(loadSite);

function loadSite() {
    var url = window.location.pathname.split("/");
    var location = url[url.length-1];

    // On dashboard
    if (location.indexOf('dashboard') != -1 || location.indexOf('getNumQuestions') != -1) {
    	if(location.indexOf('getNumQuestions') != -1){
    		putSelectedOptions();

    	}
    	sessionStorage.questionCount = 0;
        $("#domainSelect").focusout(onDomainSelectChanged);
        $("#questionCount").change(onQuestionCountChanged);
    } 
    // On exam
    else if(location.indexOf('questionExam') != -1) {
    }
    // On quick test
    else if(location.indexOf('questionTest') != -1){
    
    }
    // On results
    else if (location.indexOf('results') != -1) {
    }
};

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