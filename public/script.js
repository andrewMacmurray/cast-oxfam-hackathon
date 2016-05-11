var addUser = () => {
  var xhttp = new XMLHttpRequest();
  console.log("submitted");
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      console.log(xhttp.responseText)
    }
  };
  var url = "/addUser/" + document.getElementsById('number').input + "/" + document.getElementsById("credit").input;
  console.log(url);
  xhttp.open("GET", "/addUser/" + document.getElementsById('number').input + "/" + document.getElementsById("credit").input);
  xhttp.send();
}

document.getElementById('but').addEventListener('click', thing)

const thing = () => console.log('hi')
