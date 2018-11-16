// declaring Class Names dictionary for showing on the webpage
// mapping the the predicted class to its name
const Devanagari_CLASSES = {
    0: '',
    1: 'ka',
    2: 'kha',
    3: 'ga',
    4: 'gha',
    5: 'kna',
    6: 'cha',
    7: 'chha',
    8: 'ja',
    9: 'jha',
    10: 'yna',
    11: 'taamatar',
    12: 'thaa',
    13: 'daa',
    14: 'dhaa',
    15: 'adna',
    16: 'tabala',
    17: 'tha',
    18: 'da',
    19: 'dha',
    20: 'na',
    21: 'pa',
    22: 'pha',
    23: 'ba',
    24: 'bha',
    25: 'ma',
    26: 'yaw',
    27: 'ra',
    28: 'la',
    29: 'waw',
    30: 'motosaw',
    31: 'petchiryakha',
    32: 'patalosaw',
    33: 'ha',
    34: 'chhya',
    35: 'tra',
    36: 'gya',
    37: '0',
    38: '1',
    39: '2',
    40: '3',
    41: '4',
    42: '5',
    43: '6',
    44: '7',
    45: '8',
    46: '9'
    
    
   
  };

$(document).ready()
{
  $('.loader').hide(); // onload documrnt hide all the loaders and progress bars
  $('.loader1').hide();
  $('.progress-bar').hide();

}
// for selecting the image from local storage/device
$("#image-selector").change(function(){
    let reader = new FileReader();        // setting new filereader as reader

    reader.onload = function(){
        let dataURL = reader.result;    // on loading the reader emptying the predicted values and outputs displaed on webpage
        $("#selected-image").attr("src",dataURL);
       
        $(".pred").empty();
    }
    let file = $("#image-selector").prop('files')[0];
    reader.readAsDataURL(file);
});

// Selecting the model and loading model
$("#model-selector").change(function(){
    loadModel($("#model-selector").val()); 
    $('.loader').show();   // showing the loading  sysmbol in web-page
     $('.loader1').show();
})
// loadModel function
let model;  //intil model for function
async function loadModel(name){
    //loading model.json file from public folder DVNG_M/dvng_m which contains details of trained and saved model
    model=await tf.loadModel(`https://morning-anchorage-56517.herokuapp.com/${name}/model.json`);
    $('.loader').hide();
     $('.loader1').hide();  // upon loading hide the loading sysmbol
}

//Prediction based on input
$("#predict-button").click(async function(){
     $('.progress-bar').show();  //show progress bar while predicting
    let image= $('#selected-image').get(0); // get image from the selected file
    let tensor = preprocessImage(image,$("#model-selector").val()); //using image preprocessing of input

    let prediction = await model.predict(tensor).data();  //predicting based on the input
    let top5=Array.from(prediction)  // selecting the top propable solution it can be chaged based on requirement
                .map(function(p,i){
    return {
        probability: p,                      // assign probality and their className from predicted class
        className: Devanagari_CLASSES[i]
    };
    }).sort(function(a,b){
        return b.probability-a.probability; // slicing the number of probalities that need to be displayed
    }).slice(0,1);

 
top5.forEach(function(p){
     $('.progress-bar').hide();// hide progress while showing the result
    //$("#prediction-list").append(`<li>className: ${p.className},  probability: ${p.probability.toFixed(6)}</li>`);
    $('.pred').append('ClassName: '+p.className); // showing the predicted class in web-page
    //document.getElementById("pred").innerHTML = '${p.className}';
});

});

// Image pre-processsing
function preprocessImage(image,modelName) // takes input images and model nmae
{
    let tensor=tf.fromPixels(image)
    .resizeNearestNeighbor([32,32])   // resize input image into 32X32 or input of the model
    .toFloat();
          
    if(modelName==undefined) // case for not defined modal
    {
        return tensor.expandDims();   
    }
   
    else if(modelName=="dvng_m") // model is dvng_m 
    {
        let offset=tf.scalar(127.5); 
        // normalizing the input image this is also done during the training the model
        return tensor.sub(offset)
                    .div(offset)
                    .expandDims();
    }
     else if(modelName=="DVNG_M1")
    {
        let offset=tf.scalar(127.5);
        return tensor.sub(offset)
                    .div(offset)
                    .expandDims();
    }
    else
    {
        throw new Error("UnKnown Model error"); // throw error if model is not defined
    }
}