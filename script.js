// ======================================
// GLOBAL PAIR CONNECT INTERVIEW SYSTEM
// COMPLETE SCRIPT
// PART 1
// ======================================

// ---------- Supabase ----------

const supabase = window.supabaseClient;

// ---------- Questions ----------

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
let seconds = 0;
let timer = null;

let stream = null;
let mediaRecorder = null;
let recordedChunks = [];

// ---------- HTML ----------

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

const startBtn = document.getElementById("startBtn");
const continueBtn = document.getElementById("continueBtn");
const recordBtn = document.getElementById("recordBtn");
const stopBtn = document.getElementById("stopBtn");
const nextBtn = document.getElementById("nextBtn");

// ---------- Buttons ----------

startBtn.addEventListener("click", startInterview);
continueBtn.addEventListener("click", beginInterview);
recordBtn.addEventListener("click", startRecording);
stopBtn.addEventListener("click", stopRecording);
nextBtn.addEventListener("click", nextQuestion);

// ---------- Start Interview ----------

async function startInterview() {

welcome.style.display = "none";
identity.style.display = "block";

try{

stream = await navigator.mediaDevices.getUserMedia({

video:true,
audio:true

});

camera.srcObject = stream;
preview.srcObject = stream;

}

catch(error){

alert("Please allow access to your camera and microphone.");

console.error(error);

}

}

// ---------- Continue ----------

function beginInterview(){

if(
nameInput.value.trim()==="" ||
appIDInput.value.trim()==="" ||
emailInput.value.trim()===""
){

alert("Please complete all required information.");

return;

}

identity.style.display="none";

interview.style.display="block";

showQuestion();

}

// ---------- Show Question ----------

function showQuestion(){

progress.textContent =
"Question " +
(currentQuestion+1) +
" of " +
questions.length;

question.textContent =
questions[currentQuestion];

speak(questions[currentQuestion]);

startCountdown();

}

// ---------- Voice ----------

function speak(text){

speechSynthesis.cancel();

const speech =
new SpeechSynthesisUtterance(text);

speech.lang="en-US";
speech.rate=0.95;
speech.pitch=1;

speechSynthesis.speak(speech);

}

// ---------- Countdown ----------

function startCountdown(){

let count=5;

time.textContent="Starts in "+count;

const countdown=setInterval(()=>{

count--;

time.textContent="Starts in "+count;

if(count<=0){

clearInterval(countdown);

startTimer();

}

},1000);

}

// ---------- Timer ----------

function startTimer(){

clearInterval(timer);

seconds=0;

timer=setInterval(()=>{

seconds++;

const minutes=Math.floor(seconds/60);

const secs=seconds%60;

time.textContent=
String(minutes).padStart(2,"0")
+
":"
+
String(secs).padStart(2,"0");

},1000);

}// ======================================
// PART 2
// Recording & Upload
// ======================================

function startRecording() {

    if (!stream) {
        alert("Camera is not ready.");
        return;
    }

    recordedChunks = [];

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function (event) {

        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }

    };

    mediaRecorder.onstop = async function () {

        const videoBlob = new Blob(recordedChunks, {
            type: "video/webm"
        });

        const fileName =
            Date.now() +
            "_" +
            (nameInput.value || "candidate") +
            ".webm";

        const { error: uploadError } =
            await supabase.storage
                .from("interviews")
                .upload(fileName, videoBlob, {
                    upsert: true,
                    contentType: "video/webm"
                });

        if (uploadError) {

            console.error(uploadError);

            alert("Video upload failed.");

            return;

        }

        const {
            data: publicUrlData
        } = supabase.storage
            .from("interviews")
            .getPublicUrl(fileName);

        const { error: insertError } =
            await supabase
                .from("interviews")
                .insert([
                    {
                        full_name: nameInput.value,
                        application_id: appIDInput.value,
                        email: emailInput.value,
                        language: languageInput.value,
                        video_url: publicUrlData.publicUrl,
                        status: "Pending"
                    }
                ]);

        if (insertError) {

            console.error(insertError);

            alert("Interview saved but database insert failed.");

            return;

        }

        alert("Interview uploaded successfully.");

    };

    mediaRecorder.start();

    recordBtn.disabled = true;
    stopBtn.disabled = false;

}

function stopRecording() {

    if (
        mediaRecorder &&
        mediaRecorder.state === "recording"
    ) {

        mediaRecorder.stop();

    }

    recordBtn.disabled = false;
    stopBtn.disabled = true;

}// ======================================
// PART 3
// Next Question & Finish
// ======================================

function nextQuestion() {

    clearInterval(timer);

    currentQuestion++;

    if (currentQuestion >= questions.length) {

        interview.style.display = "none";
        finish.style.display = "block";

        if (stream) {

            stream.getTracks().forEach(track => track.stop());

        }

        speak(
            "Congratulations. You have successfully completed your Global Pair Connect interview. Thank you."
        );

        return;

    }

    showQuestion();

}

// ======================================
// Reset Buttons
// ======================================

recordBtn.disabled = false;
stopBtn.disabled = true;

// ======================================
// Browser Support Check
// ======================================

if (
    !navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia
) {

    alert(
        "Your browser does not support camera access. Please use the latest version of Chrome, Edge or Firefox."
    );

}

// ======================================
// End of Script
// ======================================
