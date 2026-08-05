// ===============================
// GLOBAL PAIR CONNECT
// SUPABASE CONFIGURATION
// ===============================

const SUPABASE_URL = "https://lozlrdwvvbflxieqqgsv.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_2h9ysrjJ4c4tv1eTv-Vreg_oH5rbmqy";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ===============================
// INTERVIEW QUESTIONS
// ===============================

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

// ===============================
// VARIABLES
// ===============================

let currentQuestion = 0;
let seconds = 0;
let timer;

let stream;
let mediaRecorder;
let recordedChunks = [];

// ===============================
// HTML ELEMENTS
// ===============================

const welcome = document.getElementById("welcome");
const identity = document.getElementById("identity");
const interview = document.getElementById("interview");
const finish = document.getElementById("finish");

const question = document.getElementById("question");
const progress = document.getElementById("progress");
const time = document.getElementById("time");

const camera = document.getElementById("camera");
const preview = document.getElementById("preview");

const nameInput = document.getElementById("name");
const appIDInput = document.getElementById("appID");
const emailInput = document.getElementById("email");

// ===============================
// BUTTONS
// ===============================

document.getElementById("startBtn").onclick = startInterview;
document.getElementById("continueBtn").onclick = beginQuestions;
document.getElementById("recordBtn").onclick = startRecording;
document.getElementById("stopBtn").onclick = stopRecording;
document.getElementById("nextBtn").onclick = nextQuestion;

// ===============================
// START INTERVIEW
// ===============================

async function startInterview() {

welcome.style.display = "none";
identity.style.display = "block";

await startCamera();

}

// ===============================
// START CAMERA
// ===============================

async function startCamera() {

try {

stream = await navigator.mediaDevices.getUserMedia({
video: true,
audio: true
});

camera.srcObject = stream;
preview.srcObject = stream;

}

catch(error){

alert("Please allow camera and microphone access.");

}

}

// ===============================
// BEGIN QUESTIONS
// ===============================

function beginQuestions(){

identity.style.display = "none";
interview.style.display = "block";

showQuestion();

}

// ===============================
// SHOW QUESTION
// ===============================

function showQuestion(){

progress.innerHTML =
"Question " + (currentQuestion + 1) + " of 10";

question.innerHTML =
questions[currentQuestion];

speak(
"Question " +
(currentQuestion + 1) +
". " +
questions[currentQuestion]
);

startCountdown();

}

// ===============================
// SPEAK QUESTION
// ===============================

function speak(text){

speechSynthesis.cancel();

const speech =
new SpeechSynthesisUtterance(text);

speech.lang = "en-US";
speech.rate = 0.95;

speechSynthesis.speak(speech);

}

// ===============================
// COUNTDOWN
// ===============================

function startCountdown(){

let count = 5;

time.innerHTML = "Starts in " + count;

const countdown = setInterval(()=>{

count--;

time.innerHTML =
"Starts in " + count;

if(count <= 0){

clearInterval(countdown);

startTimer();

}

},1000);

}

// ===============================
// TIMER
// ===============================

function startTimer(){

seconds = 0;

clearInterval(timer);

timer = setInterval(()=>{

seconds++;

const minutes =
Math.floor(seconds/60);

const secs =
seconds % 60;

time.innerHTML =
String(minutes).padStart(2,"0")
+
":"
+
String(secs).padStart(2,"0");

},1000);

}
// ===============================
// START RECORDING
// ===============================

function startRecording() {

if (!stream) {
alert("Camera is not ready.");
return;
}

recordedChunks = [];

mediaRecorder = new MediaRecorder(stream);

mediaRecorder.ondataavailable = function(event) {

if (event.data.size > 0) {
recordedChunks.push(event.data);
}

};

mediaRecorder.onstop = async function() {

const videoBlob = new Blob(recordedChunks, {
type: "video/webm"
});

const fileName =
Date.now() + "_" +
(nameInput.value || "candidate") +
".webm";

const { data, error } = await supabase.storage
.from("interviews")
.upload(fileName, videoBlob, {
upsert: true,
contentType: "video/webm"
});

if (error) {
alert("Video upload failed.");
console.error(error);
return;
}

const { data: urlData } = supabase.storage
.from("interviews")
.getPublicUrl(fileName);

await supabase
.from("interviews")
.insert([{
full_name: nameInput.value,
application_id: appIDInput.value,
email: emailInput.value,
language: "English",
video_url: urlData.publicUrl,
status: "Pending"
}]);

alert("Interview recording uploaded successfully.");

};

mediaRecorder.start();

document.getElementById("recordBtn").disabled = true;
document.getElementById("stopBtn").disabled = false;

}

// ===============================
// STOP RECORDING
// ===============================

function stopRecording() {

if (mediaRecorder &&
mediaRecorder.state === "recording") {

mediaRecorder.stop();

document.getElementById("recordBtn").disabled = false;
document.getElementById("stopBtn").disabled = true;

}

}

// ===============================
// NEXT QUESTION
// ===============================

function nextQuestion() {

clearInterval(timer);

currentQuestion++;

if (currentQuestion >= questions.length) {

interview.style.display = "none";
finish.style.display = "block";

speak(
"Congratulations. You have completed your Global Pair Connect interview."
);

return;

}

showQuestion();

}
