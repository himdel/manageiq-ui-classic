function APItest() {
  API.get('/api', {
    skipErrors: true,
    skipLoginRedirect: true,
  }).then(console.info, console.error);
}

$(APItest);

// debug
window.APItest = APItest;
