import os from 'os'

const networkInterfaces = os.networkInterfaces();

function getIP(){
  for (const name in networkInterfaces) {
    const iface = networkInterfaces[name];
    for (const address of iface) {
      if (address.family === 'IPv4' && !address.internal) {
        return (address.address);
      }
    }
  }
}

export default getIP