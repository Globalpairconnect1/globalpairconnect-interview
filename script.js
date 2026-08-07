alert("script.js loaded");
// =======================================
// GLOBAL PAIR CONNECT
// PART 1 - INITIALIZATION & CAMERA
// =======================================

// Interview Questions

const supabase = window.supabaseClient;

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

// Variables

let currentQuestion = 0;
let stream = null;
let mediaRecorder = null;
let recordedChunks = [];
let timer = null;
let seconds = 0;

// HTML Elements

const welcome = document.getElementById("welcome");
const identity = document.getElementById("identity");
const interview = document.getElementById("interview");
const finish = document.getElementById("finish");

const startBtn = document.getElementById("startBtn");
const continueBtn = document.getElementById("continueBtn");
const recordBtn = document.getElementById("recordBtn");
const stopBtn = document.getElementById("stopBtn");
const nextBtn = document.getElementById("nextBtn");

const camera = document.getElementById("camera");
const preview = document.getElementById("preview");

const progress = document.getElementById("progress");
const question = document.getElementById("question");
const time = document.getElementById("time");

const nameInput = document.getElementById("name");
const appIDInput = document.getElementById("appID");
const emailInput = document.getElementById("email");
const languageInput = document.getElementById("language");

// Buttons

startBtn.addEventListener("click", startInterview);
continueBtn.addEventListener("click", beginInterview);

// Start Interview

async function startInterview(){

welcome.style.display="none";
identity.style.display="block";

try{

stream=await navigator.mediaDevices.getUserMedia({

video:true,
audio:true

});

camera.srcObject=stream;
preview.srcObject=stream;

}catch(error){

alert("Please allow camera and microphone access.");

console.error(error);

}

}

// Continue

function beginInterview(){

if(

nameInput.value.trim()==="" ||

appIDInput.value.trim()==="" ||

emailInput.value.trim()==="" ){

alert("Please complete all required information.");

return;

}

identity.style.display="none";

interview.style.display="block";

showQuestion();

}

// =======================================
// PART 2 - QUESTIONS, VOICE & TIMER
// =======================================

// Register buttons

recordBtn.addEventListener("click", startRecording);
stopBtn.addEventListener("click", stopRecording);
nextBtn.addEventListener("click", nextQuestion);

// Show Question

function showQuestion(){

progress.textContent =
"Question " +
(currentQuestion+1) +
" of " +
questions.length;

question.textContent =
questions[currentQuestion];

speakQuestion(questions[currentQuestion]);

startCountdown();

}

// Read question aloud

function speakQuestion(text){

speechSynthesis.cancel();

const speech =
new SpeechSynthesisUtterance(text);

speech.lang="en-US";
speech.rate=0.95;
speech.pitch=1;

speechSynthesis.speak(speech);

}

// Countdown before recording

function startCountdown(){

let count=5;

time.textContent=
"Starting in " + count;

const countdown =
setInterval(()=>{

count--;

time.textContent=
"Starting in " + count;

if(count<=0){

clearInterval(countdown);

startTimer();

}

},1000);

}

// Interview timer

function startTimer(){

clearInterval(timer);

seconds=0;

timer=setInterval(()=>{

seconds++;

const mins =
Math.floor(seconds/60);

const secs =
seconds%60;

time.textContent =
String(mins).padStart(2,"0")
+
":"
+
String(secs).padStart(2,"0");

},1000);

}

// =======================================
// PART 3 - RECORDING
// =======================================

function startRecording(){

if(!stream){

alert("Camera not ready.");

return;

}

recordedChunks=[];

mediaRecorder=new MediaRecorder(stream);

mediaRecorder.ondataavailable=function(event){

if(event.data.size>0){

recordedChunks.push(event.data);

}

};

mediaRecorder.onstop=function(){

const blob=new Blob(recordedChunks,{

type:"video/webm"

});

console.log("Video recorded",blob);

alert("Recording saved successfully.");

};

mediaRecorder.start();

recordBtn.disabled=true;
stopBtn.disabled=false;

}

function stopRecording(){

if(mediaRecorder && mediaRecorder.state==="recording"){

mediaRecorder.stop();

}

recordBtn.disabled=false;
stopBtn.disabled=true;

}

// =======================================
// PART 4 - NEXT QUESTION & FINISH
// =======================================

function nextQuestion(){

clearInterval(timer);

currentQuestion++;

if(currentQuestion>=questions.length){

interview.style.display="none";

finish.style.display="block";

if(stream){

stream.getTracks().forEach(track=>track.stop());

}

speechSynthesis.cancel();

const speech=new SpeechSynthesisUtterance(
"Congratulations. You have successfully completed your Global Pair Connect interview. Thank you."
);

speech.lang="en-US";

speechSynthesis.speak(speech);

return;

}

showQuestion();

}

// Browser Support

if(!navigator.mediaDevices){

alert(
"Please use the latest version of Chrome, Edge or Firefox."
);

}

// Initial Button State

recordBtn.disabled=false;
stopBtn.disabled=true;
