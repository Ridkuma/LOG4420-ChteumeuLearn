window.firstKeyPress = true;
$('.lastAnswer').keypress(onAnswerFieldKeyPress);
$('.lastAnswer').blur(onAnswerFieldFocusOut);
$('#addQuestionButton').click(onAddQuestionButtonClicked);

// Add Question

function onAnswerFieldKeyPress() {
    if (window.firstKeyPress) {
        window.firstKeyPress = false;
        addAnswerField(this);
    }
}

function onAnswerFieldFocusOut() {
    window.firstKeyPress = true;
    if (!$(this).val()) {
        removeAnswerField(this);    
    }
}

function onAddQuestionButtonClicked() {
    $('#correctId').val($('#answers').children('input[name=correct]:checked').index('input[name=correct]'));
    var answers = $('#answers').children('input[name=answer]:not(.lastAnswer)');
    var string = "";
    for (var i = 0; i < answers.length; i++) {
        string += $(answers[i]).val() + ", ";
    };

    string = string.slice(0, string.length - 2);
    $('#answersList').val(string);
}

function addAnswerField(origin) {
    $(origin).removeClass('lastAnswer');
    var nextField = $('<input type="text" class="lastAnswer" name="answer"></input>');
    nextField.val(' ');
    if ($('input[name=answer]').length < 2) {
        nextField.attr('required', true);
    }
    nextField.keypress(onAnswerFieldKeyPress);
    nextField.blur(onAnswerFieldFocusOut);
    $(origin).after(nextField);
    $(origin).before('<input type="radio" name="correct" required></input>');
    $(origin).after('<br/>');
    $(origin).off('keypress');
}

function removeAnswerField(origin) {
    origin = $(origin);
    origin.prev().remove();
    origin.prev().remove();
    origin.remove();
}