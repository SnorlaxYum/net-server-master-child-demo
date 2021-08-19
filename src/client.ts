import net from 'net'

function main(): void {
    const con = net.createConnection('hey.sock', () => {
        console.log("[client] hey, I'm a client and connected.")
    })

    con.on('end', () => {
        console.log(`[client] bye.`)
    })
}


main()
