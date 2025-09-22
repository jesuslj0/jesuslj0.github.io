const mapContainer = document.querySelector(".map-container");
const mapForm = document.querySelector("form#map-options");
const mapSelect = document.querySelector("#map-select");
const dimensionsSpan = document.querySelector(".dimensions-span");
const minesSpan = document.querySelector(".mines-span");

const easyLevel = {
    size: 9,
    mines: 10
}

const mediumLevel = {
    size: 16,
    mines: 30
}

const hardLevel = {
    size: 25,
    mines: 80
}

class MapStorage {
    constructor(key = 'mapState') {
        this.key = key;
    }

    save(state) {
        localStorage.setItem(this.key, JSON.stringify(state));
    }

    load() {
        const data = localStorage.getItem(this.key);
        if (!data) return null;
        try {
            return JSON.parse(data);
        } catch {
            return null;
        }
    }

    clear() {
        localStorage.removeItem(this.key);
    }
}

const mapStorage = new MapStorage();

function saveGameState(storage) {
    const cells = Array.from(document.querySelectorAll(".map-container > div")).map(c => ({
        id: c.dataset.id,
        isBomb: c.dataset.isBomb,
        isFlag: c.classList.contains("flag"),
        isRevealed: c.classList.contains("revealed"),
    }));

    const state = {
        size: Math.sqrt(cells.length),
        mines: Number(document.querySelector(".mines-span").textContent.split(" ")[0]),
        flags: Number(document.querySelector(".flag-span").textContent),
        timer: {
            min: timer.min,
            sec: timer.sec,
            msec: timer.msec
        },
        cells
    };

    mapStorage.save(state);
}

function loadGameState() {
    const state = mapStorage.load();
    if (!state) return;

    createMap(state.size); // mapa vacío

    const cells = document.querySelectorAll(".map-container > div");
    for (const c of cells) {
        const saved = state.cells.find(s => s.id === c.dataset.id);
        if (!saved) continue;

        c.dataset.isBomb = saved.isBomb;

        if (saved.isFlag) {
            c.classList.add("flag");
        }

        if (saved.isRevealed) {
            c.classList.add("revealed");

            if (saved.isBomb === "false") {
                const adjacent = countAdjacentBombs(Number(c.dataset.id), state.size);
                if (adjacent > 0) {
                    c.textContent = adjacent;
                    c.style.color = getNumberColor(adjacent); // función auxiliar
                }
            }
        }
    }

    document.querySelector(".flag-span").textContent = String(state.flags);
    document.querySelector(".flag-span-max").textContent = String(state.mines);
    document.querySelector(".mines-span").textContent = `${state.mines} minas`;

    timer.min = state.timer.min;
    timer.sec = state.timer.sec;
    timer.msec = state.timer.msec;
    timer.updateDisplay();
}

function getNumberColor(n) {
    const colors = ["", "blue", "green", "red", "purple", "maroon", "turquoise", "black", "gray"];
    return colors[n] || "black";
}

class Timer {
    constructor(minId, secId, msecId) {
        this.minSpan = document.getElementById(minId);
        this.secSpan = document.getElementById(secId);
        this.msecSpan = document.getElementById(msecId);

        this.min = 0;
        this.sec = 0;
        this.msec = 0;
        this.interval = null;
    }

    start() {
        if (this.interval) return; // evita múltiples intervalos

        this.interval = setInterval(() => {
            this.msec += 10;

            if (this.msec >= 1000) {
                this.msec = 0;
                this.sec++;
            }

            if (this.sec >= 60) {
                this.sec = 0;
                this.min++;
            }

            this.updateDisplay();
        }, 10);
    }

    pause() {
        clearInterval(this.interval);
        this.interval = null;
    }

    reset() {
        this.pause();
        this.min = 0;
        this.sec = 0;
        this.msec = 0;
        this.updateDisplay();
    }

    updateDisplay() {
        this.minSpan.textContent = String(this.min).padStart(2, "0");
        this.secSpan.textContent = String(this.sec).padStart(2, "0");
        this.msecSpan.textContent = String(Math.floor(this.msec / 10)).padStart(2, "0");
    }
}

const timer = new Timer("min", "sec", "msec");

function putMines(size, mines) {
    const randomPositions = []
    for (let i = 0; i < mines; i++) {
        const rd = Math.floor(Math.random() * (size * size));
        if (randomPositions.includes(rd)) {
            i--;
            continue;
        }
        randomPositions.push(rd)
    }

    const normalizedPositions = randomPositions.map(Number);

    const cells = document.querySelectorAll(".map-container > div");
    cells.forEach(c => {
        if (normalizedPositions.includes(Number(c.dataset.id))) {
            c.dataset.isBomb = "true";
            c.classList.add("bomb");
        }
        c.classList.add("hidden");
    }) 
}

function revealFullMap() {
    const cells = document.querySelectorAll(".map-container > div");
    const size = Math.sqrt(cells.length);

    for (const c of cells) {
        c.classList.add("revealed");
        c.classList.remove("flag");

        if (c.dataset.isBomb === "true") {
            c.classList.add("bomb");
        } else {
            const adjacent = countAdjacentBombs(Number(c.dataset.id), size);
            if (adjacent > 0) {
                c.textContent = adjacent;
                c.style.color = getNumberColor(adjacent);
            }
        }
    }
}


function revealCell(cell) {
    if (cell.classList.contains("revealed")) return;
    if (cell.dataset.isFlag == "true") return;

    cell.classList.add("revealed");
    cell.classList.remove("hidden");

    if (cell.dataset.isBomb === "true") {
        revealFullMap();
        alert("¡BOOM! Fin del juego.");
        timer.pause();
        return;
    }

    const cellId = Number(cell.dataset.id);
    const size = Math.sqrt(document.querySelectorAll(".map-container > div").length);
    const adjacentBombs = countAdjacentBombs(cellId, size);
    let textColor = '';

    if (adjacentBombs > 0) {

        if (adjacentBombs == 1) {
            textColor = "blue"
        } else if (adjacentBombs == 2) {
            textColor = "green"
        } else if (adjacentBombs == 3) {
            textColor = "purple"
        } else if  (adjacentBombs >= 4) {
            textColor = "red"
        }
        cell.textContent = adjacentBombs;
        cell.style.color = textColor;
    } else {
        revealNeighbors(cellId, size);
    }
}

function countAdjacentBombs(cellId, size) {
    const neighborsOffsets = [-size-1, -size, -size+1, -1, 1, size-1, size, size+1];
    let count = 0;

    neighborsOffsets.forEach(offset => {
        const neighborId = cellId + offset;
        const neighbor = document.querySelector(`.map-container > div[data-id='${neighborId}']`);
        if (!neighbor) return;

        // Evitar desbordes de filas
        const currentRow = Math.floor((cellId-1) / size);
        const neighborRow = Math.floor((neighborId-1) / size);
        if (Math.abs(currentRow - neighborRow) > 1) return;

        if (neighbor.dataset.isBomb === "true") count++;
    });

    return count;
}

function revealNeighbors(cellId, size) {
    const neighborsOffsets = [-size-1, -size, -size+1, -1, 1, size-1, size, size+1];

    neighborsOffsets.forEach(offset => {
        const neighborId = cellId + offset;
        const neighbor = document.querySelector(`.map-container > div[data-id='${neighborId}']`);
        if (!neighbor) return;

        // Evitar desbordes de filas
        const currentRow = Math.floor((cellId-1) / size);
        const neighborRow = Math.floor((neighborId-1) / size);
        if (Math.abs(currentRow - neighborRow) > 1) return;

        if (!neighbor.classList.contains("revealed") && neighbor.dataset.isBomb !== "true") {
            revealCell(neighbor);
        }
    });
}

function putFlag(cell) {
    let nFlags = Number(document.querySelector(".flag-span").textContent);
    const maxNFlags = Number(document.querySelector(".mines-span").textContent.split(" ")[0]);

    if (cell.classList.contains("revealed")) {
        return;
    }

    if (cell.classList.contains("flag")) {
        cell.classList.remove("flag");
        cell.classList.add("hidden");
        cell.dataset.isFlag = "false";
        nFlags--;
    } else {
        if (nFlags >= maxNFlags) {
            alert("Máximo número de banderas colocadas");
            return;
        }
        cell.classList.add("flag");
        cell.classList.remove("hidden");
        cell.dataset.isFlag = "true";
        nFlags++;
    }

    document.querySelector(".flag-span").textContent = String(nFlags);
    document.querySelector(".flag-span-max").textContent = String(maxNFlags);
}

function checkGame() {
    const maxNFlags = Number(document.querySelector(".mines-span").textContent.split(" ")[0]);
    const nFlags = Number(document.querySelector(".flag-span").textContent);

    if (nFlags !== maxNFlags) return;

    const bombs = document.querySelectorAll(".map-container > div[data-is-bomb='true']");
    for (const bomb of bombs) {
        if (!bomb.classList.contains("flag")) {
            return;
        }
    }

    timer.pause();
    revealFullMap();
    alert("¡Has ganado!");

    // Bloquear interacción
    const cells = document.querySelectorAll(".map-container > div");
    for (const cell of cells) {
        const newCell = cell.cloneNode(true);
        cell.replaceWith(newCell); // elimina listeners
    }
}

function createMap(size) {
    mapContainer.innerHTML = "";

    const mapContainerWidth = (size * 20) + (size - 1); 
    mapContainer.style.width = `${mapContainerWidth}px`;
    mapContainer.style.height = `${mapContainerWidth}px`;
    mapContainer.style.gridTemplateColumns = `repeat(${size}, 20px)`;
    mapContainer.style.gridTemplateRows = `repeat(${size}, 20px)`;
    mapContainer.style.outline = "2px solid white";
    let dataIndex = 0;
    
    for (let i = 0; i < (size * size); i++) {
        const cell = document.createElement("div");
        cell.style.width = "20px"
        cell.style.height = "20px"
        cell.classList.add("hidden");
        
        //Data Atributes
        dataIndex++
        cell.dataset.isBomb = "false";
        cell.dataset.id = dataIndex;

        cell.addEventListener("click", event => {
            event.preventDefault();
            document.querySelector('form#map-options').style.display = "none";
            document.querySelector('button.restart-btn').removeAttribute("disabled");
            
            timer.start();
            revealCell(cell);
            saveGameState(mapStorage);
        })

        cell.addEventListener("contextmenu", ev => {
            ev.preventDefault();
            putFlag(cell);
            saveGameState(mapStorage);
            checkGame();
        });
        mapContainer.appendChild(cell);
    }

    mapContainer.style.display = "grid";

    dataIndex = 0;
}

mapSelect.addEventListener("change", event => {
    event.preventDefault();
    const level = mapSelect.value;
    
    const levels = {
        easy: easyLevel,
        medium: mediumLevel,
        hard: hardLevel,
        default: easyLevel,
    }

    const selectedLevel = levels[level] || levels.default;

    dimensionsSpan.textContent = `${selectedLevel.size}x${selectedLevel.size}`;
    minesSpan.textContent = `${selectedLevel.mines} minas`;
})

document.addEventListener("DOMContentLoaded", event => {
    mapSelect.value = "easy";    
    dimensionsSpan.textContent = `${easyLevel.size}x${easyLevel.size}`;
    minesSpan.textContent = `${easyLevel.mines} minas`;
    document.querySelector('.restart-btn').setAttribute("disabled", true);
    document.querySelector('.start-btn').setAttribute("disabled", true);

    // Poner mapa si hay uno guardado 
    if (mapStorage.load() !== null) {
        loadGameState();
        document.querySelector('.start-btn').setAttribute("disabled", false);
    }

    mapForm.addEventListener("submit", ev => {
        ev.preventDefault()
        const level = mapSelect.value;
        
        const levels = {
            easy: easyLevel,
            medium: mediumLevel,
            hard: hardLevel,
            default: easyLevel
        }

        const selectedLevel = levels[level] || levels.default;
        createMap(selectedLevel.size);
        putMines(selectedLevel.size, selectedLevel.mines);

        document.querySelector('.start-btn').removeAttribute("disabled");
        const mines = document.querySelector('.mines-span').textContent.split(' ')[0];
        document.querySelector('.flag-span-max').textContent = `${mines}`;
        document.querySelector('.flag-span').textContent = "0";
        saveGameState(mapStorage);
    })

    const startButton = document.querySelector('.start-btn');
    startButton.addEventListener('click', event => {
        event.preventDefault();
        document.querySelector('form#map-options').style.display = "none";
        document.querySelector('button.restart-btn').removeAttribute("disabled");
        timer.start();
    })

    const restartButton = document.querySelector('.restart-btn');
    restartButton.addEventListener('click', ev => {
        ev.preventDefault();
        document.querySelector('#map-options').style.display = "flex";

        const level = mapSelect.value;
        const levels = {
            easy: easyLevel,
            medium: mediumLevel,
            hard: hardLevel,
            default: easyLevel
        };
        const selectedLevel = levels[level] || levels.default;

        createMap(selectedLevel.size);
        putMines(selectedLevel.size, selectedLevel.mines);

        document.querySelector("#submit-btn").textContent = "Actualizar Mapa";
        timer.reset();
        document.querySelector('.flag-span').textContent = "0";
        document.querySelector('.flag-span-max').textContent = String(selectedLevel.mines);
        document.querySelector('.mines-span').textContent = `${selectedLevel.mines} minas`;

        mapStorage.clear();
    });
});