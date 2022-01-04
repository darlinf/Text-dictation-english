var pitch = document.querySelector("#pitch");
var pitchValue = document.querySelector(".pitch-value");
var rate = document.querySelector("#rate");
var rateValue = document.querySelector(".rate-value");
var joinUs = true;
var words;
var speechWords;
var wordFromDom;
var wordSp, wordTp;
var showWords = document.getElementById("showWords");
var talkShow = document.getElementById("talkShow");
var voices = [];
var synth = window.speechSynthesis;
var iWordSp = 0;
var iSpeak = 0;
var pause = true;
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

pitch.onchange = function () {
  pitchValue.textContent = pitch.value;
};

rate.onchange = function () {
  rateValue.textContent = rate.value;
};

recognition.onresult = function (event) {
  talkShow.innerHTML = event.results[0][0].transcript;
};

recognition.onspeechend = function () {
  recognition.stop();
};

recognition.onnomatch = function (event) {
  diagnostic.textContent = "I didn't recognise that color.";
};

recognition.onerror = function (event) {
  diagnostic.textContent = "Error occurred in recognition: " + event.error;
};

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

document.getElementById("inputfile").addEventListener("change", function () {
  var fr = new FileReader();
  fr.onload = function () {
    words = fr.result.replace(/(\r\n|\n|\r)/gm, "|").split("|");
    wordTp = stringAddToTag(words);
    wordSp = stringSeparateWords(words);
  };
  fr.readAsText(this.files[0]);
});

function talk() {
  recognition.start();
}

function forSpeech() {
  speechWords = wordSp[iWordSp];
  showWords.innerHTML = wordTp[iWordSp];
  wordFromDom = document.querySelectorAll(".wordContainer > span");
  iWordSp++;
  speak();
}

function stringSeparateWords(words) {
  var kLength = words.length;
  for (var k = 0; k < kLength; k++) words[k] = words[k].split(" ");
  return words;
}

function stringAddToTag([...words]) {
  let jLength = words.length;
  for (var j = 0; j < jLength; j++) {
    words[j] =
      "<span>" + words[j].replace(/\s/g, "</span><span>&nbsp;") + "</span>";
  }
  return words;
}

function pauses() {
  if (pause) pause = false;
  else {
    pause = true;
    speak();
  }
}

function populateVoiceList() {
  voices = synth.getVoices().sort(function (a, b) {
    const aname = a.name.toUpperCase(),
      bname = b.name.toUpperCase();
    if (aname < bname) return -1;
    else if (aname == bname) return 0;
    else return +1;
  });
}

function join() {
  if (joinUs) {
    joinUs = false;
    speak();
  } else {
    joinUs = true;
    speak();
  }
}

function back() {
  iSpeak--;
  speak();
}

function speak() {
  if (synth.speaking) {
    console.error("speechSynthesis.speaking");
    return;
  }
  if (joinUs) {
    var utterThis = new SpeechSynthesisUtterance(speechWords[iSpeak]);
    wordFromDom[iSpeak].classList.add("mystyle");
  } else {
    var utterThis = new SpeechSynthesisUtterance(speechWords);
  }

  utterThis.onend = function (event) {
    iSpeak++;
    if (speechWords.length != iSpeak && joinUs == true) {
      if (pause) speak(speechWords);
    } else {
      iSpeak = 0;
      forSpeech();
    }
  };
  utterThis.onerror = function (event) {
    console.error("SpeechSynthesisUtterance.onerror");
  };
  utterThis.voice = voices[11];
  utterThis.pitch = pitch.value;
  utterThis.rate = rate.value;
  synth.speak(utterThis);
}
