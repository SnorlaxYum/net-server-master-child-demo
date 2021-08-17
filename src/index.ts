import net from 'net'

function main(): void {
    const server = net.createServer((c) => {
        console.log('client connected')
        c.on('end', () => {
            console.log('client disconnected')
        })
        c.write('hello\r\n')
        c.pipe(c)
    })
    server.on('error', err => {
        throw err
    })
    server.listen('hey.sock', () => {
        console.log('server bound')
    })
}

main()
