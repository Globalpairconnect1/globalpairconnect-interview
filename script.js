alert("JavaScript is running!");
const questions = [
"Tell us about yourself and explain why you would like to become an au pair.",
"Describe your experience caring for children.",
"Why do you want to live with a host family in Europe?",
"Describe a challenging situation with a child and how you handled it.",
"How would you manage homesickness while living abroad?",
"What would you do if a child refused to follow your instructions?",
"Describe what a normal working day as an au pair would look like.",
"What personal qualities make you a good au pair?",
"What would you do if you had a disagreement with your host family?",
"Is there anything else you would like the Global Pair Connect team to know about you?"
];

let currentQuestion = 0;
let stream = null;

const welcome = document.getElementById("welcome");
const identity = document.getElementById("identity");
const interview = document.getElementById("interview");
const finish = document.getElementById("finish");

const question = document.getElementById("question");
const progress = document.getElementById("progress");

const camera = document.getElementById("camera");
const preview = document.getElementById("preview");

document.getElementById("startBtn").onclick = startInterview;
document.getElementById("continueBtn").onclick = beginInterview;
document.getElementById("nextBtn").onclick = nextQuestion;

async function startInterview(){

    welcome.style.display="none";
    identity.style.display="block";

    try{

        stream = await navigator.mediaDevices.getUserMedia({
            video:true,
            audio:true
        });

        camera.srcObject = stream;
        preview.srcObject = stream;

    }catch(err){

        alert("Please allow camera and microphone access.");

        console.error(err);

    }

}

function beginInterview(){

    interview.style.display="block";
    identity.style.display="none";

    showQuestion();

}

function showQuestion(){

    progress.textContent =
    "Question " +
    (currentQuestion+1) +
    " of " +
    questions.length;

    question.textContent =
    questions[currentQuestion];

    speechSynthesis.cancel();

    const speech =
    new SpeechSynthesisUtterance(
        questions[currentQuestion]
    );

    speech.lang="en-US";

    speechSynthesis.speak(speech);

}

function nextQuestion(){

    currentQuestion++;

    if(currentQuestion>=questions.length){

        interview.style.display="none";
        finish.style.display="block";

        if(stream){

            stream.getTracks().forEach(track=>track.stop());

        }

        return;

    }

    showQuestion();

}
