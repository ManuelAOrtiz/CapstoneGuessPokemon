var mysteryWord = document.getElementById('mysteryWord');
var submit = document.getElementById('submit');
var letter = document.getElementById('letter')
var start = document.getElementById('start');
var guessedArea = document.getElementById('guessedArea');
var hintArea = document.getElementById('hintArea');
var hint = document.getElementById('hint');
var hintImg = document.getElementById('hintImg')
var guessed = document.getElementById('guessed');
var progress = document.getElementById('progress')
var score = document.getElementById('score');
var userScore = document.getElementById("userScore");
var potion = document.createElement("DIV");
potion.id = "potion";
var timer = document.createElement("DIV");
timer.id = "timer";
progress.appendChild(timer);
var pokemon = [];
var usedPokemonNumber= [];
var userPotion = 1;
var counter = 0;
var displayWord = [];
var guessedLetters = [];
var correctLetters = [];
var getHintCounter = 0;
var timeAfterLastHint = 0;
var succeededGuessing = false;
var scored = 0;
var gen1 = false;
var gen2 = false;
var gen3 = false;
var gen4 = false;
var gen5 = false;
var gen6 = false;
var gen7 = false;

class Pokemon{
	constructor(num){
		this.name;
		this.pokeId = num;
		this.types = [];
		this.image;
		this.flavorText;
		this.getPokemon(num);
	}
	getPokemon(num){
		var that = this;
		$.ajax({url: "https://fizal.me/pokeapi/api/"+num+".json",
			success: function(result){
			// console.log(result)
				 that.name = result.name;
				 for(let i = 0;i<result.types.length;i++){
				 	that.types.push(result.types[i].type.name);
				 }
				 that.image = result.sprites.front_default;
				 that.getFlavorText(result.species.url)
			}	
		})
	}
	getFlavorText(api){
		var that = this;
		setTimeout(function(){
			$.ajax({url: api, 
			success: function(result){
				// console.log(result);
				for(let i = 0; i<result.flavor_text_entries.length; i++){
					if(result.flavor_text_entries[i].language.name == "en"){
						that.flavorText = result.flavor_text_entries[i].flavor_text
					}
				}
				that.flavorText = that.flavorText.split(" ");
				for(let i = 0; i<that.flavorText.length;i++){
					if(that.flavorText[i].indexOf(String.fromCharCode(10))!==-1){
						var index = that.flavorText[i].indexOf(String.fromCharCode(10));
						var beforeIt = that.flavorText[i].slice(0,index);
						var afterIt = that.flavorText[i].slice((index+1),that.flavorText[i].length)
						var newString = beforeIt + " " + afterIt;
						that.flavorText[i] = newString;
					}
				}
				that.flavorText = that.flavorText.join(" ")
			}	
		})},100);
	}
}


function getRandomPokemon(){
		var number = randomNumberMaker();
		if(number==6){
			number= Math.floor(Math.random()*(807-722)+722)
		}else if(number==5){
			number= Math.floor(Math.random()*(721-650)+650);
		}else if(number==4){
			number= Math.floor(Math.random()*(649-494)+494);
		}else if(number==3){
			number= Math.floor(Math.random()*(493-387)+387);
		}else if(number==2){
			number= Math.floor(Math.random()*(386-252)+252);
		}else if(number==1){
			number= Math.floor(Math.random()*(251-152)+152);
		}else{
			number= Math.floor(Math.random()*(151-1)+1);
		}


		if(usedPokemonNumber.includes(number)==true){
			getRandomPokemon();
		}else{
			var poke = new Pokemon(number);
			usedPokemonNumber.push(number);
			pokemon.push(poke);
		}
		setTimeout(function(){
			getMysteryWord()
		},1000) 
}
function startGame(){
	mysteryWord.innerHTML = " ";
	scored.innerHTML = " ";
	progress.innerHTML = " "
	progress.style.height = "0"
	progress.style.width = "0"
	score.style.height = "0"
	score.style.height = "0"
	wrapper.style.height = "104vh"
	preStartGameStep1();
}
function startActualGame(){
	mysteryWord.innerHTML = " "
	wrapper.style.height = "99vh"
	mysteryWord.style.gridRow = "2/3"
	mysteryWord.style.gridColumn = "2/3"
	hintArea.style.gridColumn = "1/3"
	hintImg.style.gridColumn = "3/4"
	hintImg.style.gridRow = "1/2"
	hintArea.innerHTML = " ";
	hintImg.style.height = "0"
	hintImg.style.width = "0"
	progress.style.height = "auto"
	progress.style.width = "auto"
	score.style.height = "auto"
	score.style.height = "auto"
	score.style.gridRow = "2/3"
	score.style.gridColumn = "1/2"
	progress.style.gridRow = "2/3";
	progress.style.gridColumn = "3/4";
	mysteryWord.style.display = "inline"
	pokemon = [];
	progress.appendChild(potion);
	getRandomPokemon();
	timer.innerHTML = 10;
	// setTimeout(function(){getMysteryWord()},500);
	makePotion();

	var hpBar = document.createElement("Progress");
	hpBar.id = "health";	
	hpBar.max = "10";
	hpBar.value = "10";
	hpBar.innerHTML = hpBar.value;

	progress.appendChild(hpBar);
	userScore.innerHTML = "Your score is: "+scored
}

function makePotion(){
	potion.style.backgroundImage = "url('images/Potion.png')";
	potion.style.height = "150px";
	potion.style.width = "150px";
	potion.style.margin = "0 auto"
	potion.style.backgroundSize = "100% 100%";
}
function usePotion(){
	if(health.value<10&&userPotion>0) {
		var potion = document.getElementById("potion");
		userPotion--;
		if(userPotion==0){
			var potion = document.getElementById("potion");
			potion.style.height = "0"
			potion.style.width = "0";
		}
	}

	if(health.value<8){
		health.value +=2;
	}else{
		health.value = 10;
	}
}

function getMysteryWord(){
	displayWord = [];
	var succeededGuessing = false;
	var regEx = /[a-z]/;

	for(let i = 0; i< pokemon[counter].name.length; i++){
		if(pokemon[counter].name.charCodeAt(i)>96&&pokemon[counter].name.charCodeAt(i)<123){
			displayWord.push("_");
		}else{
			displayWord.push(pokemon[counter].name[i]);
		}
	}
	for(let i = 0; i<displayWord.length;i++){
		mysteryWord.innerHTML += " "+displayWord[i]+" ";
	}
	hintArea.style.fontSize = "1.5em";
	hintArea.style.fontWeight = "bold"
	hintArea.innerHTML = " ";
	hintArea.innerHTML = "Pokemon Number: "+usedPokemonNumber[counter];
	succeededGuessing==false;
}

function guessLetter(letter){
	var health = document.getElementById('health')
	// timer.innerHTML = " "
	var passFail = [];
	for(let i = 0; i<pokemon[counter].name.length;i++){
		if(pokemon[counter].name[i]==letter){
			displayWord[i] = letter;
			passFail.push(true);
		}
	}
	if(passFail.includes(true)==false){
		health.value --;
		health.content = "attr(value)"
	}
	guessed.innerHTML = guessedLetters.join(" ");
	mysteryWord.innerHTML = " ";
	for(let i = 0; i<pokemon[counter].name.length;i++){
		mysteryWord.innerHTML += " "+displayWord[i]+" ";
	}
	if(displayWord.join("") == pokemon[counter].name){
		scored++;
		guessedArea.innerHTML = " "+displayWord.join("")+" ";
		mysteryWord.innerHTML = " ";
		userScore.innerHTML = "Your score is: "+scored
		if(scored%5==0){
			if(userPotion==0){
				makePotion();
				userPotion++;
			}
		}
		getHintCounter = 0;
		hintArea.innerHTML = " ";
		hintArea.innerHTML = " Congrats! You guessed Correctly. Here's the next pokemon!"
		timer.innerHTML = " ";
		correctLetters = [];
		guessedLetters = [];
		succeededGuessing = true;
		hintImg.style.filter = "contrast(100%) brightness(100%)";
		hintImg.style.backgroundImage = "url('"+pokemon[counter].image+"')";
		hintImg.style.backgroundSize = "100% 100%";
		hintImg.style.height = "150px";
		hintImg.style.width = "150px";
		hintImg.style.margin = "0 auto"
		counter++;
		setTimeout(function(){
			hintImg.style.backgroundSize = "0 0";
			getRandomPokemon();
		},5000)
		}
	if(health.value == 0){
		endGame();
	}
}

function endGame(){

		mysteryWord.innerHTML = "Game Over!"
		var newDiv = document.createElement("DIV");
		newDiv.innerHTML = "Your score is "
		if(userPotion==1){
			scored = 5+ scored;
		}
		newDiv.innerHTML += scored;
		mysteryWord.appendChild(newDiv);
}

function getHint(){
	if(getHintCounter==0){
		var type = document.createElement("DIV");
		type.innerHTML = "Type: " + pokemon[counter].types+". ";
		hintArea.appendChild(type)
		var entry = document.createElement("DIV");
		entry.innerHTML = pokemon[counter].flavorText;
		entry.style.fontSize = ".9em";
		hintArea.appendChild(entry);
		getHintCounter++;
	}else if(getHintCounter==1){
		hintImg.style.filter = "contrast(0%) brightness(50%)";
		hintImg.style.backgroundImage = "url('"+pokemon[counter].image+"')";
		hintImg.style.backgroundSize = "100% 100%";
		hintImg.style.height = "150px";
		hintImg.style.width = "150px";
		hintImg.style.margin = "0 auto"
		var secondHintCounter = counter;
		timeAfterLastHint = 10;
		timer.innerHTML = timeAfterLastHint;
		progress.appendChild(timer)
		getHintCounter++;
		hintTimer();
	}
}
function hintTimer(){
		var x = setInterval(function(){
			if(timeAfterLastHint!==0&&succeededGuessing==true){
				clearInterval(x)
			}else if(timeAfterLastHint==0&&health.value==0){
				clearInterval(x);
				endGame();
			}else if(timer.innerHTML=""){
				clearInterval(x)
			}else if(timeAfterLastHint!==0){
				timeAfterLastHint--;
				timer.innerHTML = timeAfterLastHint;
			}else{
				health.value--;
				timeAfterLastHint = 10;
				timer.innerHTML = timeAfterLastHint;
			}
		}, 1000)
}
start.addEventListener('click', function(){
	startGame();
})

submit.addEventListener('click', function(){
	guessLetter(letter.value);
	letter.value = "";
} )

hint.addEventListener('click',function(){
	getHint();
})

progress.addEventListener('click', function(e){
	if(e.target.id = "potion"){
		if(userPotion>0){
			usePotion();
		}
	}
})

document.addEventListener('keypress',function(e){
	if(e.key == "Enter"&&letter.value!==""){
		guessLetter(letter.value);
		letter.value = "";
	}
})

mysteryWord.addEventListener('click', function(e){
	if(e.target.id == "done"){
		checkGenStuff();
		startActualGame();
	}
})


function preStartGameStep1(){
	mysteryWord.innerHTML = " ";
	mysteryWord.style.gridColumn = "2/4";
	mysteryWord.style.gridRow = "2/3";
	mysteryWord.style.display = "grid"
	mysteryWord.style.gridTemplateRows = "1fr 1fr 1fr"
	mysteryWord.style.gridTemplateColumns = "1fr 1fr 1fr 1fr"
	for(let i = 0; i<7;i++){

		var check = document.createElement("INPUT");
		check.type = "checkbox";
		check.name = "generation";
		check.value = "value";
		check.id = "box"+(i+1);		
		var label = document.createElement("label");
		label.htmlFor = "box"+(i+1);
		label.appendChild(document.createTextNode("gen"+(i+1)));
		mysteryWord.appendChild(label);
		mysteryWord.appendChild(check);
	}

	var button = document.createElement("BUTTON");
	button.innerHTML = "done";
	button.id = "done";
	mysteryWord.appendChild(button);

}
function checkGenStuff(){
	var box1 = document.getElementById("box1");
	var box2 = document.getElementById("box2");
	var box3 = document.getElementById("box3");
	var box4 = document.getElementById("box4");
	var box5 = document.getElementById("box5");
	var box6 = document.getElementById("box6");
	var box7 = document.getElementById("box7");

	if(box1.checked==true){
		gen1 = true;
	}
	if(box2.checked==true){
		gen2 = true;
	}
	if(box3.checked==true){
		gen3 = true;
	}
	if(box4.checked==true){
		gen4 = true;
	}
	if(box5.checked==true){
		gen5 = true;
	}
	if(box6.checked==true){
		gen6 = true;
	}
	if(box7.checked==true){
		gen7 = true;
	}
}

function randomNumberMaker(){
	var number = Math.floor(Math.random()*6);
	if(number == 6){
		if(gen7==true){
			return number;
		}else{
			randomNumberMaker()
		}
	}else if(number == 5){
		if(gen6==true){
			return number;
		}else{
			randomNumberMaker()
		}
	}else if(number == 4){
		if(gen5==true){
			return number;
		}else{
			randomNumberMaker()
		}
	}else if(number == 3){
		if(gen4==true){
			return number;
		}else{
			randomNumberMaker()
		}
	}else if(number == 2){
		if(gen3==true){
			return number;
		}else{
			randomNumberMaker()
		}
	}else if(number == 1){
		if(gen2==true){
			return number;
		}else{
			randomNumberMaker()
		}
	}else{
		if(gen1==true){
			return number;
		}else{
			randomNumberMaker()
		}
	}
}
