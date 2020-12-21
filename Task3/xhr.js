const urls = [
    "https://jsonplaceholder.typicode.com/todos",
    "https://jsonplaceholder.typicode.com/users"
  ];
  
function sendRequest(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);

        xhr.onload = () => {
            if(xhr.status >=400) {
                reject(xhr.response)
            }else {
                resolve(xhr.response)
            }
        };

        xhr.onerror = () => {
            reject(xhr.response)
        };

        xhr.send();
    });
}

Promise.all(urls.map(sendRequest)).then(() => console.log("Both answers received!"))