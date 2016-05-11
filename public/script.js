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



const addCharge = () => {
 console.log(' charge working');
 const price = document.getElementById('price').value
 const code = document.getElementById('code').value
 var xhr = new XMLHttpRequest();
 xhr.onreadystatechange = () => {
   console.log('thing1')
   if(xhr.readyState === 4 && xhr.status === 200){
     console.log(xhr.responseText);
   }
 }
 xhr.open('GET', '/charge/' + price + '/' + code);
 xhr.send();
}

document.getElementById('chargebutton').addEventListener('click', addCharge);
