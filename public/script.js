const addUser = () => {
  console.log('working');
  const number = document.getElementById('number').value
  const credit = document.getElementById('credit').value
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    console.log('thing')
    if(xhr.readyState === 4 && xhr.status === 200){
      console.log(xhr.responseText);
    }
  }
  xhr.open('GET', '/addUser/' + number + '/' + credit);
  xhr.send();
}

document.getElementById('but').addEventListener('click', addUser);