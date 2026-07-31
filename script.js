const questions = [
"Tell us about yourself.",
"Why do you want to join Global Pair Connect?",
"Describe your childcare experience.",
"How do you handle stressful situations?",
"Describe a difficult situation and how you solved it.",
"Why should a host family choose you?",
"How would you adapt to another culture?",
"How do you manage your time?",
"What are your strengths and weaknesses?",
"Do you have any final comments?"
];

let currentQuestion = 0;
let seconds = 0;
let timer = null;

const welcome = document.getElementById("welcome");
const identity = document.getElementById("identity");
const interview = document.getElementById("interview");
const finish = document.getElementById("finish");

const startBtn = document.getElementById("startBtn");
const continueBtn = document.getElementById("continueBtn");
const nextBtn = document.getElementById("nextBtn");
const recordBtn = document.getElementById("recordBtn");
const stopBtn = document.getElementById("stopBtn");

const question = document.getElementById("question");
const progress = document.getElementById("progress");
const time = document.getElementById("time");

startBtn.onclick = () => {
    welcome.style.display = "none";
    identity.style.display = "block";
    startCamera();
};

continueBtn.onclick = () => {
    identity.style.display = "none";
    interview.style.display = "block";
    document.getElementById("preview").srcObject =
        document.getElementById("camera").srcObject;
};

recordBtn.onclick = () => {
    seconds = 0;

    if(timer) clearInterval(timer);

    timer = setInterval(() => {
        seconds++;

        let min = String(Math.floor(seconds/60)).padStart(2,"0");
        let sec = String(seconds%60).padStart(2,"0");

        time.innerHTML = min + ":" + sec;
    },1000);
};

stopBtn.onclick = () => {
    clearInterval(timer);
};

nextBtn.onclick = () => {

    clearInterval(timer);

    seconds = 0;
    time.innerHTML = "00:00";

    currentQuestion++;

    if(currentQuestion >= questions.length){

        interview.style.display = "none";
        finish.style.display = "block";
        return;

    }

    question.innerHTML = questions[currentQuestion];
    progress.innerHTML =
        "Question " + (currentQuestion+1) + " of 10";

};

async function startCamera(){

try{

const stream = await navigator.mediaDevices.getUserMedia({
video:true,
audio:true
});

document.getElementById("camera").srcObject = stream;

}catch(err){

alert("Camera access denied.");

}

}
