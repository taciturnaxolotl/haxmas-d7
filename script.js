const date = new Date();
const days = date.getDate();
const month = date.getMonth() + 1;
const year = date.getFullYear();

//list of emoji ornaments and star emojis
const ornamentEmojis = [
	"🔴",
	"🟢",
	"🔵",
	"🟡",
	"🟣",
	"🟠",
	"🎁",
	"🎀",
	"🔔",
	"❄️",
	"⛄",
	"🕯️",
	"🧦",
	"🍬",
	"🍭",
	"🎅",
	"🤶",
	"🦌",
];
const stars = ["⭐", "💫", "💖", "🎄", "🏴‍☠️", "👾"];

function changeStar() {
	const randomIndex = Math.floor(Math.random() * 6);
	document.querySelector("star").innerText = stars[randomIndex];
}

function addOrnament(e) {
	const main = document.querySelector("main");
	const mainRect = main.getBoundingClientRect();

	const x = e.clientX - mainRect.left;
	const y = e.clientY - mainRect.top;

	const ornament = document.createElement("span");
	ornament.className = "ornament";
	ornament.innerText =
		ornamentEmojis[Math.floor(Math.random() * ornamentEmojis.length)];
	ornament.style.left = `${x}px`;
	ornament.style.top = `${y}px`;

	ornament.addEventListener("click", (e) => {
		e.stopPropagation();
		ornament.remove();
	});

	document.querySelector("decorations").appendChild(ornament);
}

document.addEventListener("DOMContentLoaded", () => {
	const dateText = document.querySelector("time");
	const star = document.querySelector("star");

	dateText.innerText = `${days}/${month}/${year}`;

	star.addEventListener("click", changeStar);
	document.querySelector("main").addEventListener("click", addOrnament);
});
