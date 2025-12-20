//getting date  
const date = new Date();  
const days = date.getDate();  
const month = date.getMonth() + 1;  
const year = date.getFullYear();  

//list of emoji ornaments and star emojis  
const ornamentEmojis = ["🔴", "🟢", "🔵", "🟡", "🟣", "🟠", "🎁", "🎀", "🔔", "❄️", "⛄", "🕯️", "🧦", "🍬", "🍭", "🎅", "🤶", "🦌"];  
const stars = ["⭐", "💫", "💖", "🎄", "🏴‍☠️", "👾"];  

let currentOrnaments = [];
let boundaryPoints = {
    top: { x: 0.425, y: 0.11935953420669577 },
    left: { x: 0.27666666666666667, y: 0.7030567685589519 },
    right: { x: 0.7516666666666667, y: 0.7001455604075691 }
};

function changeStar(){  
    let randomIndex = Math.floor(Math.random() * 6 );  
    document.getElementById("star").innerText = stars[randomIndex];  
}  

function updateTriangleOutline() {
    const container = document.getElementById("tree-container");
    const rect = container.getBoundingClientRect();
    const svg = document.getElementById("triangle-outline");
    const polygon = document.getElementById("triangle-shape");
    
    const topX = boundaryPoints.top.x * rect.width;
    const topY = boundaryPoints.top.y * rect.height;
    const leftX = boundaryPoints.left.x * rect.width;
    const leftY = boundaryPoints.left.y * rect.height;
    const rightX = boundaryPoints.right.x * rect.width;
    const rightY = boundaryPoints.right.y * rect.height;
    
    polygon.setAttribute("points", `${topX},${topY} ${leftX},${leftY} ${rightX},${rightY}`);
}

function isPointInTriangle(px, py, ax, ay, bx, by, cx, cy) {
    const v0x = cx - ax;
    const v0y = cy - ay;
    const v1x = bx - ax;
    const v1y = by - ay;
    const v2x = px - ax;
    const v2y = py - ay;

    const dot00 = v0x * v0x + v0y * v0y;
    const dot01 = v0x * v1x + v0y * v1y;
    const dot02 = v0x * v2x + v0y * v2y;
    const dot11 = v1x * v1x + v1y * v1y;
    const dot12 = v1x * v2x + v1y * v2y;

    const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    return (u >= 0) && (v >= 0) && (u + v <= 1);
}

function checkOverlap(x, y, existingPositions, minDistance = 50) {
    for (let pos of existingPositions) {
        const dx = x - pos.left;
        const dy = y - pos.top;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < minDistance) {
            return true;
        }
    }
    return false;
}

function getTrianglePosition(treeContainer, index, total, existingPositions = []) {
    const containerRect = treeContainer.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    const topX = boundaryPoints.top.x * containerWidth;
    const topY = boundaryPoints.top.y * containerHeight;
    const leftX = boundaryPoints.left.x * containerWidth;
    const leftY = boundaryPoints.left.y * containerHeight;
    const rightX = boundaryPoints.right.x * containerWidth;
    const rightY = boundaryPoints.right.y * containerHeight;
    
    let x, y;
    let attempts = 0;
    const maxAttempts = 500;
    
    do {
        const r1 = Math.random();
        const r2 = Math.random();
        
        const sqrtR1 = Math.sqrt(r1);
        x = (1 - sqrtR1) * topX + sqrtR1 * (1 - r2) * leftX + sqrtR1 * r2 * rightX;
        y = (1 - sqrtR1) * topY + sqrtR1 * (1 - r2) * leftY + sqrtR1 * r2 * rightY;
        
        attempts++;
    } while (
        (!isPointInTriangle(x, y, topX, topY, leftX, leftY, rightX, rightY) || 
         checkOverlap(x, y, existingPositions)) && 
        attempts < maxAttempts
    );
    
    return { left: x, top: y };
}

function makeBoundaryPointDraggable(element, pointName) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        element.classList.add("dragging");
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        const newTop = element.offsetTop - pos2;
        const newLeft = element.offsetLeft - pos1;
        
        element.style.top = newTop + "px";
        element.style.left = newLeft + "px";
        
        const container = document.getElementById("tree-container");
        const rect = container.getBoundingClientRect();
        
        boundaryPoints[pointName].x = newLeft / rect.width;
        boundaryPoints[pointName].y = newTop / rect.height;
        
        updateTriangleOutline();
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        element.classList.remove("dragging");
        
        console.log("Current boundary points:");
        console.log(`top: { x: ${boundaryPoints.top.x}, y: ${boundaryPoints.top.y} }`);
        console.log(`left: { x: ${boundaryPoints.left.x}, y: ${boundaryPoints.left.y} }`);
        console.log(`right: { x: ${boundaryPoints.right.x}, y: ${boundaryPoints.right.y} }`);
    }
}

function initializeBoundaryPoints() {
    const container = document.getElementById("tree-container");
    const rect = container.getBoundingClientRect();
    
    const topPoint = document.getElementById("point-top");
    const leftPoint = document.getElementById("point-left");
    const rightPoint = document.getElementById("point-right");
    
    topPoint.style.left = (boundaryPoints.top.x * rect.width) + "px";
    topPoint.style.top = (boundaryPoints.top.y * rect.height) + "px";
    
    leftPoint.style.left = (boundaryPoints.left.x * rect.width) + "px";
    leftPoint.style.top = (boundaryPoints.left.y * rect.height) + "px";
    
    rightPoint.style.left = (boundaryPoints.right.x * rect.width) + "px";
    rightPoint.style.top = (boundaryPoints.right.y * rect.height) + "px";
    
    makeBoundaryPointDraggable(topPoint, "top");
    makeBoundaryPointDraggable(leftPoint, "left");
    makeBoundaryPointDraggable(rightPoint, "right");
    
    updateTriangleOutline();
}

function createOrnaments() {
    const decorations = document.getElementById("decorations");
    const treeContainer = document.getElementById("tree-container");
    
    decorations.innerHTML = '';
    currentOrnaments = [];
    let existingPositions = [];
    
    if (month === 12) {
        let daysTilChristmas = Math.max(25 - days, 0);

        for (let i = 0; i < daysTilChristmas; i++) {
            const randomEmoji = ornamentEmojis[Math.floor(Math.random() * ornamentEmojis.length)];
            decorations.innerHTML += `<span class="ornament" id="ornament${i}">${randomEmoji}</span>`;
            const ornament = document.getElementById("ornament" + i);
            
            const pos = getTrianglePosition(treeContainer, i, daysTilChristmas, existingPositions);
            ornament.style.left = pos.left + "px";
            ornament.style.top = pos.top + "px";
            
            existingPositions.push(pos);
            currentOrnaments.push(ornament);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {  
    const dateText = document.getElementById("date");  
    const star = document.getElementById("star");  

    dateText.innerText = days + "/" + month + "/" + year;  

    initializeBoundaryPoints();
    createOrnaments();

    star.addEventListener('click', changeStar);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'r' || e.key === 'R') {
            createOrnaments();
        }
    });
})
