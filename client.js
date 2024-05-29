const socket = io();

const button = document.getElementById('button');

let team = null

socket.on("team", (id) => {
  if(team === null){
    team = id
    button.classList.add(id === 1 ? "a" : "b")
    button.addEventListener('click', () => {
      socket.emit('button_pressed', team); // Enviar ID del jugador al servidor
    });
  }
})


socket.on('winner', (playerId) => {
    alert(`¡Jugador ${playerId} gana!`);
    // const h1 = document.createElement("h2")
    // h1.textContent = playerId === team ? "Ganaste" : "Perdiste"
    // document.body.appendChild(h1)
});
