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
	let randomIndex = Math.floor(Math.random() * 6);
	document.querySelector("star").innerText = stars[randomIndex];
}

document.addEventListener("DOMContentLoaded", () => {
	const dateText = document.querySelector("time");
	const star = document.querySelector("star");

	dateText.innerText = `${days}/${month}/${year}`;

	star.addEventListener("click", changeStar);
});
