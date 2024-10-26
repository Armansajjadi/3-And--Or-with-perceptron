let weight1 = null;
let weight2 = null;
let b = null;
let data = []

let alfa = 1

let teta = 0.2

let points = [];

const subButton = document.getElementById("subButton");

const trainForm = document.getElementById("trainForm")

const trainBtn = document.getElementById("trainBtn")

const testForm = document.getElementById("testForm")

const testselect1 = document.getElementById("testselect1")

const testselect2 = document.getElementById("testselect2")

const testsubButton = document.getElementById("testsubButton")

let select1 = document.getElementById("select1");
let select2 = document.getElementById("select2");
let select3 = document.getElementById("select3");


window.addEventListener("load", () => {

  fetch('trainData.json')
      .then(response => {
          if (!response.ok) {
              throw new Error('File not found');
          }
          return response.json();
      })
      .then(data => {
          console.log("Data exists, returning 1");
          console.log("Weight1:", data.weight1,"Weight2:",weight2);
          console.log("b:", data.b);

          weight1 = data.weight1;
          weight2=data.weight2
          b = data.b;


          trainForm.classList.add("hidden");
          testForm.classList.remove("hidden");

      })
      .catch(error => {
          console.log("No data found or error occurred, returning 0");
          console.error(error);

          weight1=0
          weight2=0
          b=0
      });
});


function save(x1, x2, y) {
  let obj = {
    x1,
    x2,
    y
  }
  data.push(obj);
  console.log(`saved with x1: ${x1}, x2: ${x2}, y: ${y}`)
}


subButton.addEventListener("click", e => {
  e.preventDefault();
  const x1 = parseFloat(select1.value);
  const x2 = parseFloat(select2.value);
  const y = parseFloat(select3.value);


  save(x1, x2, y);



});

trainBtn.addEventListener("click", e => {
  e.preventDefault();
  alert("you have trained the ANN, now you can test");
  trainForm.classList.add("hidden");
  testForm.classList.remove("hidden");

  let training = true;
  let epoch = 0;

  let old_weight1 = 0;
  let old_weight2 = 0;
  let old_bias = 0;

  while (training) {

    old_weight1 = weight1;
    old_weight2 = weight2;
    old_bias = b;

    data.forEach(dataset => {
      let yn = (weight1 * dataset.x1) + (weight2 * dataset.x2) + b;
      let res = null;

      if (yn > teta) {
        res = 1;
      } else if (yn >= (-teta) && yn <= teta) {
        res = 0;
      } else {
        res = -1;
      }

      if (res != dataset.y) {
        weight1 += alfa * dataset.x1 * dataset.y;
        weight2 += alfa * dataset.x2 * dataset.y;
        b += alfa * dataset.y;
      }

    });

    if (weight1 == old_weight1 && weight2 == old_weight2 && b == old_bias) {
      training = false;
    }

    epoch++;

    console.log("Epoch:", epoch, "Weight1:", weight1, "Weight2:", weight2, "Bias:", b);
  }

  console.log("Training finished successfully after", epoch, "epochs.");

  const dataOftrain = {
    weight1,
    weight2,
    b
  };

  const jsonData = JSON.stringify(dataOftrain);

  const blob = new Blob([jsonData], { type: 'application/json' });

  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'trainData.json';  // نام فایلی که دانلود می‌شود
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);

  URL.revokeObjectURL(url);

  console.log("Data has been saved as JSON file!");
});


testsubButton.addEventListener("click", e => {
  e.preventDefault();

  let result = null

  let x1 = parseFloat(testselect1.value);
  let x2 = parseFloat(testselect2.value);

  if (!isNaN(x1) && !isNaN(x2)) {

    let yn = b + weight1 * x1 + weight2 * x2

    if (yn > teta) {
      result = 1
    } else if (yn >= ((-1) * teta) && yn <= teta) {
      result = 0
    } else {
      result = -1
    }

    alert(`result : ${result}`)

  } else {
    alert("Please fill all the select options.");
  }
});
