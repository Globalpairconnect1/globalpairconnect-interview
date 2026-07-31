<script>

let stream;

let current = 0;

let seconds = 0;

let timerInterval;

const questions = [

"Tell us about yourself.",

"Why do you want to become an au pair with Global Pair Connect?",

"Describe your childcare experience.",

"How do you handle stressful situations?",

"Tell us about a challenge you solved.",

"What makes you a good candidate for a host family?",

"How would you adapt to another culture?",

"How do you organize your daily responsibilities?",

"What are your strengths and areas you want to improve?",

"Do you have any final comments for our team?"

];

function startInterview(){

document.getElementById("welcome").style.display="none";

startCamera();

}

async function startCamera(){

try{

stream = await navigator.mediaDevices.getUserMedia({

video:true,

audio:true

});

document.getElementById("camera").srcObject =
