const socket = io();
const $root = document.querySelector("div")

console.log("")

socket.on('winner', (playerId) => {
    console.log(playerId)
    $root.innerHTML = ""
    const h1 = document.createElement("h2")
    h1.textContent = `El equipo ${playerId} gana!`
    $root.appendChild(h1)
    $root.classList.add("active")
    $root.classList.add(playerId === 1 ? "a" : "b")
    $root.classList.remove(playerId !== 1 ? "a" : "b")
});