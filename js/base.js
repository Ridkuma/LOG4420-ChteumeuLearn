		$(document).ready(loadSite);
		
		function loadSite() {
			$('.header').load("header.html");
			$('.footer').load("footer.html"); 
			$( "#formSelect" ).change(getSelected);
			$("#questionNumber").change(getQuestionNumber);
			var preg = "";
			var preg = getQuestion();
			$('.questionExam').text(preg);
		};


		function getSelected(){
			var str = [];
			$('#formSelect option:selected').each(function(){
				str.push($(this).text());			
		})
			sessionStorage.setItem("options", str);
		};

		function getQuestionNumber(){
			sessionStorage.setItem("questionNumber", $(this).val());
		};

		function getQuestion(){
			var quest = "";
			var questions = [];
			var domains = sessionStorage.getItem("options");
			for(i=0;i<data.length;i++){
				if(domains.indexOf(data[i].domain) != -1){
					questions.push(data[i].question);
					quest = data[i].question;
				}
			}
			sessionStorage.setItem("questions",questions);
			return quest;
		};