// ======================================
// GLOBAL PAIR CONNECT INTERVIEW SYSTEM
// Part 1
// ======================================

// ---------- Supabase ----------
const supabase = window.supabaseClient;

// ---------- Interview Questions ----------
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

// ---------- Variables ----------
let currentQuestion = 0;
let timer = null;
let seconds = 0;

let stream = null;
let mediaRecorder = null;
let recordedChunks = [];

// ---------- HTML Elements ----------
const welcome = document.getElementById("welcome");
const identity = document.getElementById("identity");
const interview = document.getElementById("interview");
const finish = document.getElementById("finish");

const camera = document.getElementById("camera");
const preview = document.getElementById("preview");

const question = document.getElementById("question");
const progress = document.getElementById("progress");
const time = document.getElementById("time");

const nameInput = document.getElementById("name");
const appIDInput = document.getElementById("appID");
const emailInput = document.getElementById("email");
const languageInput = document.getElementById("language");

// ---------- Buttons ----------
document.getElementById("startBtn").addEventListener("click", startInterview);
document.getElementById("continueBtn").addEventListener("click", beginInterview);
document.getElementById("recordBtn").addEventListener("click", startRecording);
document.getElementById("stopBtn").addEventListener("click", stopRecording);
document.getElementById("nextBtn").addEventListener("click", nextQuestion);

// ---------- Start Interview ----------
async function startInterview() {

    welcome.style.display = "none";
    identity.style.display = "block";

    try {

        stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });

        camera.srcObject = stream;
        preview.srcObject = stream;

    } catch (err) {

        alert("Please allow access to your camera and microphone.");
        console.error(err);

    }

}

// ---------- Continue ----------
function beginInterview() {

    if (
        nameInput.value.trim() === "" ||
        appIDInput.value.trim() === "" ||
        emailInput.value.trim() === ""
    ) {

        alert("Please complete all your details.");
        return;

    }

    identity.style.display = "none";
    interview.style.display = "block";

    showQuestion();

}
