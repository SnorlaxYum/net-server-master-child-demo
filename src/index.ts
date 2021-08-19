import net from 'net'
import {isMaster, workers, fork, Worker} from 'cluster'
import {cpus} from 'os'
import process from 'process'
import fs from 'fs'

function main(): void {
    if(isMaster) {
        let numReqs = 0

        function messageHandler(msg: {cmd: string}, worker?: Worker) {
            if(msg.cmd && msg.cmd === 'notify') {
                numReqs++
               if(worker && worker.id) {
                    console.log(`worker ${worker.id} dealing with it. ${numReqs} requests now`)
               } 
            }
        }

        const numCPUs = cpus().length
        

        for(let i = 0; i < numCPUs; i++) {
            fork()
        }

        for(const id in workers) {
            workers[id]!.on('message', msg => messageHandler(msg, workers[id]))
        }
    } else {
        const server = net.createServer((c) => {
            console.log('[server] client connected')
            c.on('end', () => {
                console.log('[server] client disconnected')
            })
            c.write('[server] hello\r\n')
            process.send!({cmd: 'notify'})
        })

        server.on('error', err => {
            throw err
        })

        server.on('close', () => {
            fs.access('hey.sock', fs.constants.F_OK, (e) => {
                if(!e) {
                    fs.unlink('hey.sock', (e) => {
                        if(!e) {
                            console.log('sock deletion success')
                        }
                    })
                }
            })
        })

        server.listen('hey.sock', () => {})
    }
}


main()
