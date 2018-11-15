const IMAGENET_CLASSES = {
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
  $('.loader').hide();
  $('.loader1').hide();
  $('.progress-bar').hide();

}
$("#image-selector").change(function(){
    let reader = new FileReader();

    reader.onload = function(){
        let dataURL = reader.result;
        $("#selected-image").attr("src",dataURL);
        $("#prediction-list").empty();
        $(".pred").empty();
    }
    let file = $("#image-selector").prop('files')[0];
    reader.readAsDataURL(file);
});


$("#model-selector").change(function(){
    loadModel($("#model-selector").val());
    $('.loader').show();
     $('.loader1').show();
})

let model;
async function loadModel(name){
    model=await tf.loadModel(`https://morning-anchorage-56517.herokuapp.com/${name}/model.json`);
    $('.loader').hide();
     $('.loader1').hide();
}


$("#predict-button").click(async function(){
     $('.progress-bar').show();
    let image= $('#selected-image').get(0);
    let tensor = preprocessImage(image,$("#model-selector").val());

    let prediction = await model.predict(tensor).data();
    let top5=Array.from(prediction)
                .map(function(p,i){
    return {
        probability: p,
        className: IMAGENET_CLASSES[i]
    };
    }).sort(function(a,b){
        return b.probability-a.probability;
    }).slice(0,1);

$("#prediction-list").empty();
top5.forEach(function(p){
     $('.progress-bar').hide();
    //$("#prediction-list").append(`<li>className: ${p.className},  probability: ${p.probability.toFixed(6)}</li>`);
    $('.pred').append('ClassName: '+p.className);
    //document.getElementById("pred").innerHTML = '${p.className}';
});

});


function preprocessImage(image,modelName)
{
    let tensor=tf.fromPixels(image)
    .resizeNearestNeighbor([32,32])
    .toFloat();//.sub(meanImageNetRGB)
          
    if(modelName==undefined)
    {
        return tensor.expandDims();
    }
    else if(modelName=="vgg")
    {
        let meanImageNetRGB= tf.tensor1d([123.68,116.779,103.939]);
        return tensor.sub(meanImageNetRGB)
                    .reverse(2)
                    .expandDims();
    }
    else if(modelName=="dvng_m")
    {
        let offset=tf.scalar(127.5);
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
        throw new Error("UnKnown Model error");
    }
}