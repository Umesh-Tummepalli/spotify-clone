let i = 0;
let s12 = 0;
let showall = document.querySelector("#showall");
let poppularbtn = document.querySelector("#Popularartist");
let playlist1= document.querySelector(".spotifyplaylist1");
let leftplaylist = document.querySelector("#leftplaylist");
let currentsong = new Audio();
let playpause = document.querySelector("#playsong");
let forwardsong = document.querySelector("#forwardsong");
let backsong = document.querySelector("#backsong");
let songinfo = document.querySelector(".songinfo");
let songduration = document.querySelector(".songtime");
let circle = document.querySelector(".circle");
let seekbar = document.querySelector(".seekbar");
let hambur = document.querySelector("#hamburger");
let left = document.querySelector(".left");
let home = document.querySelector("#homebtn");

// chnage here
let songslist;
let datafolder;
let Songfile

let leftarrow = document.querySelector("#leftarrow");

// ---------fetching songs from the document --------------

let folderfile = "http://127.0.0.1:3000/songs"; 
( async function folders(){
  foldders=await fetch(folderfile);
  txtformat=await foldders.text();
  div=document.createElement('div');
  div.innerHTML=txtformat;
  atags=div.querySelectorAll('a');
 Array.from(atags).forEach((x)=>{
    if(x.href.includes("/songs")){
     foldername=x.href.split('/songs/')[1];
     file=foldername;
     foldername=foldername.replaceAll('%20'," ")
     foldername=foldername.replaceAll('/',"")
    //  foldername=foldername.split('/')[1];
     card=document.createElement('div');
     card.setAttribute('class','card');
     card.setAttribute('data-folder',`${file}`);
     console.log(card.getAttribute('data-folder'));
     card.innerHTML=` <img src="imgs/${foldername}.jpeg" alt="" />
     <button class="playbtn1">
       <img src="play.svg" alt="" class="play" />
     </button>
     <h4>${foldername}</h4>
     <span>Artist</span>`
     playlist1.append(card);
    }
  })
    playbtn=document.getElementsByClassName('playbtn1');
    Array.from(playbtn).forEach((x)=>{
      x.addEventListener('click',(e)=>{
        hamburg();
        datafolder=e.currentTarget.parentElement.getAttribute('data-folder');
        Songfile = `http://127.0.0.1:3000/songs/${datafolder}`;
        leftplaylist.innerHTML="";
       fetchsongdata(Songfile);
      })
    })
})()

async function fetchsongdata(Songfile) {
  songs = await fetch(Songfile);
  usable = await songs.text();
  div = document.createElement("div");
  div.innerHTML = usable;
  atags = div.querySelectorAll("a");
  let playablesongs = [];
  Array.from(atags).forEach((x) => {
    if (x.href.endsWith(".mp3")||x.href.endsWith(".m4a")) {
      playablesongs.push(x.href);
    }
  });
   
  (async function getsongs() {
    songslist = playablesongs;
    // var audio = new Audio(songslist);
    // audio.play();
    songslist.forEach((x) => {
      let li = document.createElement("li");
      somevar = x;
      somevar = somevar.split(`${datafolder}`)[1]; // change here
      somevar = somevar.replaceAll("%20", " ");
      somevar = somevar.replaceAll(".mp3", "");
      somevar = somevar.replaceAll(".m4a", "");
      somevar = somevar.replaceAll("-", " ");
      somevar = somevar.replaceAll("_", " ");
      li.innerHTML = `<div><img src='music.svg' />${somevar}</div> <img src='whiteplay.svg' id='leftplay'/>`;
      // li.classList.add(x);
      li.setAttribute('data-link',x);
      leftplaylist.append(li);
      let list = leftplaylist.querySelectorAll("#leftplay");
  
      Array.from(list).forEach((e) => {
        e.addEventListener("click", (x) => {
          playsong(x.target.parentElement.getAttribute('data-link'));
        });
        
      });
    });
  })();
}
//------------ appending songs in to the left playlist bar--------
function playsong(s) {
  somea = s;
  currentsong.src = somea;
  if (currentsong.paused) {
    currentsong.play();
    songinfo.innerHTML = document.querySelector(`li[data-link="${s}"]`).innerText;
    playpause.src = `pause-line.svg`;
    playpause.style.width = "30px";
  }
}

playpause.addEventListener("click", () => {
  if (currentsong.paused) {
    currentsong.play();
    playpause.src = `pause-line.svg`;
    playpause.style.width = "30px";
  } else {
    currentsong.pause();
    playpause.src = `whiteplay.svg`;
    playpause.style.width = "20px";
  }
});

currentsong.addEventListener("timeupdate", () => {
  totduration = currentsong.duration;
  if(totduration==NaN){

    songduration.innerHTML = "00:00/00:00";
  }
  else{
  songduration.innerHTML = `${secondsToMinutes(currentsong.currentTime)}/${secondsToMinutes(totduration)}`;
}
  seekcent = (currentsong.currentTime * 100) / totduration;
  circle.style.left = `${seekcent - 2}%`;
  if(currentsong.currentTime==totduration){
    forwardmusic();
  }
});

function secondsToMinutes(seconds) {
  const secNum = parseInt(seconds, 10);
  const minutes = Math.floor(secNum / 60);
  const remainingSeconds = secNum % 60;

  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;
  return formattedMinutes + ":" + formattedSeconds;
}
seekbar.addEventListener("click", (e) => {
  seekbarcent = e.offsetX / e.target.getBoundingClientRect().width;
  currentsong.currentTime = seekbarcent * currentsong.duration;
});
function hamburg(){
  left.style.left = 0;
}
hambur.addEventListener("click", () => {
  document.querySelector(".right").style.opacity = 0.3;
  hamburg();
});
home.addEventListener("click", () => {
  left.style.left = `${-80}vw`;
  document.querySelector(".right").style.opacity = 1;
});
function forwardmusic(){
  index = songslist.indexOf(currentsong.src);
  if (index+1 === songslist.length) {
    currentsong.src = songslist[0];

  } else {
    currentsong.src = songslist[index + 1];
  }
  playpause.src = `pause-line.svg`;
    playpause.style.width = "30px";
    playsong(currentsong.src);
}
forwardsong.addEventListener("click", () => {
  forwardmusic();
});
backsong.addEventListener("click", () => {
  index = songslist.indexOf(currentsong.src);
  if (index-1 ===-1 ) {
    currentsong.src = songslist[songslist.length-1];
    
  } else {
    currentsong.src = songslist[index - 1];
  }
  playpause.src = `pause-line.svg`;
  playpause.style.width = "30px";
  playsong(currentsong.src);
});

