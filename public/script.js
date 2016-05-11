const addUser = () => {
  const xhttp = new XMLHttpRequest();
  console.log("submitted");
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      console.log(xhttp.responseText)
    }
  };
  xhttp.open("GET", "/addUser" + document.getElementsById('number') + "/" + document.getElementsById("credit"));
  xhttp.send();
}

document.getElementById("submit").addEventListener('submit', addUser)
