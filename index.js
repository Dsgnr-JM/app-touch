import path from 'path'
import express from 'express'
import { Server } from "socket.io";
import chalk from 'chalk'
import inquirer from 'inquirer';
import getIP from './getIP.js'

const log = console.log
const dirname = import.meta.dirname

const app = express();

const initStrig = [chalk.whiteBright(`  🖐️ Bienvenid@ a Touch-App, desarrollado por JotaDev 💻 \n`),
chalk.blueBright("\n  Instrucciones")
  ,
chalk.dim.white(`
  - Espere a que la app se inicie
  - Se necesitan dos jugadores(Trabajando para añadir mas)
  - Conectarse o una red wifi o LAN( Si quieres jugar con celulares o dispositivos separados)
  - Abrir una pestaña del navegador y tipea la direccion ip: ${getIP()}:3000
  - Ya puedes jugar
`),
chalk.redBright("\n  Restricciones"),
chalk.dim.white(`
  - No se pueden conectar mas de dos dispositivos
  - Se necesita una red local para un rendimiento optimo y sin latencia
  - Algunos navegadores pueden ser incompatibles
  - Ambos jugadores deben cliquear el boton para resetear
  `)
]

const notInitString = "   😠 Operacion cancelada... Cerrando terminal"

const serverInitString = "  🚀 La app se ha iniciado \n"
const loadingClientString = "  Esperando Clientes... \n"

const clientConnectString = `  -----------------------------
    😄 Nuevo cliente conectado
  -----------------------------`

const clientChargedString = "  Cliente nro:"

const winnerString = (name) => {
  const text = `
  ===============================================
   El Equipo ${name} presionó el botón primero 
  ===============================================`
  return name === 2 ? chalk.blueBright(text) : chalk.redBright(text)
}

const clientDisconnected = `  -----------------------------
    😥 Un cliente se desconecto
  -----------------------------`

log(...initStrig)

inquirer.prompt({
  type: "confirm",
  name: "init",
  message: "Quieres iniciar el juego"
}).then(res => {
  if (res.init) return init()
  log(chalk.greenBright(notInitString))
})

const init = () => {
  const server = app.listen(3000, () => {
    log(chalk.greenBright(serverInitString), chalk.dim.whiteBright(loadingClientString))
  })
  const io = new Server(server);

  let firstClientId = null;
  let idFirstSocket = null;
  let prepared = false;

  io.on('connection', (socket) => {
    log(chalk.whiteBright(clientConnectString));
    if (!prepared) {
      io.emit('team', 1)
      prepared = true
      idFirstSocket = socket.id
      log(chalk.italic.dim.whiteBright(clientChargedString), chalk.bold.bgRedBright.black(1))
    } else {
      io.emit('team', 2)
      log(chalk.italic.dim.whiteBright(clientChargedString), chalk.bold.bgBlueBright.black(2))
    }

    socket.on('button_pressed', (id) => {

      if (firstClientId === null && id !== firstClientId) {
        firstClientId = id;
        log(winnerString(firstClientId))
        io.emit('winner', firstClientId);
        inquirer.prompt({
          type: "confirm",
          name: "reset",
          message: "Reiniciar"
        }).then(res => {
          if( res.reset ) 
            firstClientId = null;
        })
      }
      if (firstClientId !== null && firstClientId !== id) {
        firstClientId = null;
      }
    });

    socket.on('disconnect', () => {
      log(chalk.whiteBright(clientDisconnected));
      if (socket.id === idFirstSocket) {
        prepared = null
      }
    });
  });

  app.use(express.static(dirname))

  app.get("/hola", (req, res) => {
    res.sendFile(path.join(dirname, "server.html"))
  })
}

