export default function logger(message, data) {
    fetch('https://log.ngrok.io/', {
        method: 'post',
        body: JSON.stringify({
            message,
            data
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
}
