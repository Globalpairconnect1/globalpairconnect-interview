const questions = [
"Tell us about yourself and explain why you would like to become an au pair.",
"Describe your experience caring for children.",
"Why do you want to live with a host family in Europe?",
"Describe a challenging situation with a child and how you handled it.",
"How would you manage homesickness while living abroad?",
"How would you react if a child refused to follow your instructions?",
"Describe what a normal working day as an au pair would look like.",
"What personal qualities make you a good au pair?",
"What would you do if you had a disagreement with your host family?",
"Is there anything else you would like the Global Pair Connect team to know about you?"
];

let currentQuestion = 0;
let timer;
let seconds = 0;

const welcome = document.getElementById("welcome");
const identity = document.getElementById("identity");
const interview = document.getElementById("interview");
const finish = document.getElementById("finish");

const question = document.getElementById("question");
const progress = document.getElementById("progress");
const time = document.getElementById("time");

document.getElementById("startBtn").onclick = startInterview;
document.getElementById("continueBtn").onclick = beginQuestions;
document.getElementById("nextBtn").onclick = nextQuestion;

async function startInterview(){

welcome.style.display="none";
identity.style.display="block";

speak("Welcome to the Global Pair Connect Video Interview. Please enter your details below.");

startCamera();

}

async function startCamera(){

try{

const stream = await navigator.mediaDevices.getUserMedia({
video:true,
audio:true
});

document.getElementById("camera").srcObject=stream;
document.getElementById("preview").srcObject=stream;

}catch(e){

alert("Please allow camera and microphone access.");

}

}

function beginQuestions(){

identity.style.display="none";
interview.style.display="block";

showQuestion();

}

function showQuestion(){

progress.innerHTML="Question "+(currentQuestion+1)+" of 10";

question.innerHTML=questions[currentQuestion];

speak(
"Question "+
(currentQuestion+1)+". "+
questions[currentQuestion]
);

startCountdown();

}

function speak(text){

speechSynthesis.cancel();

let speech=new SpeechSynthesisUtterance(text);

const language =
document.getElementById("language").value;

speech.lang = language;

speech.rate=0.95;

speech.pitch=1;

speechSynthesis.speak(speech);

}

function startCountdown(){

let count=5;

time.innerHTML="Starts in "+count;

const countdown=setInterval(()=>{

count--;

time.innerHTML="Starts in "+count;

if(count<=0){

clearInterval(countdown);

startTimer();

}

},1000);

}

function startTimer(){

seconds=0;

timer=setInterval(()=>{

seconds++;

let m=Math.floor(seconds/60);
let s=seconds%60;

time.innerHTML=
String(m).padStart(2,"0")+":"+
String(s).padStart(2,"0");

},1000);

}

function nextQuestion(){

clearInterval(timer);

currentQuestion++;

if(currentQuestion>=questions.length){

interview.style.display="none";
finish.style.display="block";

speak(
"Congratulations. You have successfully completed your Global Pair Connect interview. Thank you."
);

return;

}

showQuestion();

}
