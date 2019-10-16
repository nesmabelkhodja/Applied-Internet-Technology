function main(){
	//set up
	const game = document.getElementById('#game');
	const form = document.querySelector('form');
	//Generate a Deck of Cards
	//let cards52 = createDeck();
	//console.log(deck);
	let player = [];
	let cpu = [];
 	let stnrdDeck = createDeck();
 	let playerTotal = 0;
 	let cpuTotal = 0;
 	let count = 1;
 	let cpuCount = 1;
	
	document.querySelector(".playBtn").addEventListener("click", function(evt){
		evt.preventDefault();

		let deck = []
		let input = document.querySelector('#startValues');
		cheat = input.value.trim();
		cheat = cheat.split(',');
		let num = 0;
		if (cheat[0] !== ''){
			for (i=0; i<cheat.length; i++){
					if (cheat[i]==='A'){
						num = 11;
					}
					else if (cheat[i]==='J'){
						num = 11;
					}
					else if (cheat[i]==='Q'){
						num = 12;
					}
					else if (cheat[i]==='K'){
						num = 13;
					}
					else{
						num = cheat[i];
					}
					deck.push({'value':cheat[i], 'suit':"♥", 'num':parseInt(num)});
					if (deck[i].value === ''){
						deck.pop;
					}
			}
		}
		deck = deck.concat(stnrdDeck);

		//adding starting cards
		cpu.push(deck.shift());
		player.push(deck.shift());
		cpu.push(deck.shift());
		player.push(deck.shift());

		//adding starting cards to totallet temp = deck.shift();
		playerTotal = player[0].num + player[1].num;
		if (playerTotal > 21 && (player[0].value === 'A' || player[1].value === 'A')){
				playerTotal-=10;
			}

		cpuTotal = cpu[0].num + cpu[1].num;
		if (cpuTotal > 21 && (cpu[0].value === 'A' || cpu[1].value === 'A')){
				cpuTotal-=10;
			}


		//display starting cards and totals
		//display player total
		let heading1 = document.createElement("h1");
		let content = document.createTextNode("Computer Hand - Total: ?");
		heading1.appendChild(content);

		let currentDiv = document.querySelector(".game");
		document.body.appendChild(heading1, currentDiv);

		//adding total
		newDiv = document.createElement("span");
		content = document.createTextNode(" ");
		newDiv.appendChild(content);

		currentDiv = document.querySelector(".game");
		document.body.appendChild(newDiv, currentDiv);

		newDiv = document.createElement("p");
		content = document.createTextNode(cpu[1].value+" "+cpu[1].suit);
		newDiv.appendChild(content);

		currentDiv = document.querySelector(".game");
		document.body.appendChild(newDiv, currentDiv);

		//display player total
		let heading = document.createElement("h1");
		heading.id = "player";
		content = document.createTextNode("Player Hand - Total: "+playerTotal);
		heading.appendChild(content);

		currentDiv = document.querySelector(".game");
		document.body.appendChild(heading, currentDiv);

		//player cards
		newDiv = document.createElement("p");
		content = document.createTextNode(player[0].value+" "+player[0].suit);
		newDiv.appendChild(content);

		currentDiv = document.querySelector(".game");
		document.body.appendChild(newDiv, currentDiv);

		newDiv = document.createElement("p");
		content = document.createTextNode(player[1].value+" "+player[1].suit);
		newDiv.appendChild(content);

		currentDiv = document.querySelector(".game");
		document.body.appendChild(newDiv, currentDiv);

		//creating buttons
		let hit = document.createElement("BUTTON");
		content = document.createTextNode("Hit");
		hit.className = "hit"; 
		hit.appendChild(content);

		currentDiv = document.querySelector(".game");
		document.body.appendChild(hit, currentDiv);

		//stand
		let stand = document.createElement("BUTTON");
		content = document.createTextNode("Stand");
		stand.className = "stand";
		stand.appendChild(content);

		currentDiv = document.querySelector(".game");
		document.body.appendChild(stand, currentDiv);

		//hit
		hit.addEventListener("click", function(evt){
			let temp = deck.shift();
			player.push(temp);
			playerTotal += parseInt(temp.num);
			if (playerTotal > 21 && (player[player.length-1].value === 'A')){
				playerTotal-=10;
			}
			
			//new card
			newDiv = document.createElement("p");
			content = document.createTextNode(player[player.length-1].value+" "+player[player.length-1].suit);
			newDiv.appendChild(content);

			currentDiv = document.querySelector(".game");
			document.body.appendChild(newDiv, currentDiv);

			//update total
			let newHeading = document.createElement("h1");
			newHeading.id = "player";
			content = document.createTextNode("Player Hand - Total: "+playerTotal);
			newHeading.appendChild(content);
			currentDiv = document.querySelector(".game");
			document.body.appendChild(newHeading, currentDiv);

			const prev = document.getElementById('player');
			let parent = prev.parentNode;
			parent.replaceChild(newHeading, prev);
			
			//check if there is a winner
			if (playerTotal > 21){
					renderResult(player, cpu, playerTotal, cpuTotal, "You lose!!! :(")
				}

		

		});

		//stand
		stand.addEventListener("click", function(evt){
			const act = Math.floor(Math.random() * 2);
			if (act === 1){
			let temp = deck.shift();
			cpu.push(temp);
			cpuTotal += parseInt(temp.num);
			if (cpuTotal > 21 && (cpu[cpu.length-1].value === 'A')){
				cpuTotal-=10;
			}

			if (cpuTotal>21)
			{
				renderResult(player, cpu, playerTotal, cpuTotal, "You win!!! :)");
			}
		}
		if (act === 2){
			if (playerTotal > cpuTotal){
				renderResult(player, cpu, playerTotal, cpuTotal, "You win!!! :)");
			}
			else if (cpuTotal > playerTotal){
				renderResult(player, cpu, playerTotal, cpuTotal, "You lose!!! :(");
			}
			else if (playerTotal === cpuTotal)
			{
				renderResult(player, cpu, playerTotal, cpuTotal, "It's a tie!");
			}
		}

		});

		//create and apply the appropriate CSS classes to get rid of the form (do this with styles, there's no need to remove the element)
		form.classList.toggle('hidden');
		
		});
}


function createDeck(){
	let deck = [];
	let number = '';
	let suit = '';
	let card = {};
	for(num=1; num<=12; num++){
		if (num<10){
			number = num;
		}
		else if (num === 1){
			number = 'A';
			num = 11;
		}
		else if (num === 10) {
			number = 'J';
		}
		else if (num === 11) {
			number = 'Q';
		}
		else if (num === 12) {
			number = 'K';
		}
		for(s=0; s<4; s++){
			if (s===0){
				suit = '♠';
			}
			else if (s===1){
				suit = '♥';
			}
			else if (s===2){
				suit = '♣';
			}
			else if (s===3){
				suit = '♦';
			}
			deck.push({'value':number, 'suit':suit, 'num':parseInt(num)});
		}
	}
	//shuffle deck (using Durstenfeld algorithm)
	let j = 0;
	let temp = {};
	for (index = deck.length - 1; index>0; index--) {
       j = Math.floor(Math.random() * (index + 1));
       temp = deck[index];
       deck[index] = deck[j];
       deck[j] = temp;
    }

	return deck;
}

function renderResult(player, cpu, playerTotal, cpuTotal, message){
	document.body.innerHTML = '';
		//display player total
		let heading = document.createElement("h1");
		let content = document.createTextNode("Computer Hand - Total: "+cpuTotal);
		heading.appendChild(content);

		let currentDiv = document.querySelector(".game");
		document.body.appendChild(heading, currentDiv);

		let newDiv = document.createElement("p");

		//adding cpu cards
		for (i=0; i<cpu.length; i++){
			newDiv = document.createElement("p");
			content = document.createTextNode(cpu[i].value+" "+cpu[i].suit);
			newDiv.appendChild(content);

			currentDiv = document.querySelector(".game");
			document.body.appendChild(newDiv, currentDiv);
		}

		//display player total
		heading = document.createElement("h1");
		content = document.createTextNode("Player Hand - Total: "+playerTotal);
		heading.appendChild(content);

		currentDiv = document.querySelector(".game");
		document.body.appendChild(heading, currentDiv);

		//player cards
			for (i=0; i<player.length; i++){
			newDiv = document.createElement("p");
			content = document.createTextNode(player[i].value+" "+player[i].suit);
			newDiv.appendChild(content);

			currentDiv = document.querySelector(".game");
			document.body.appendChild(newDiv, currentDiv);
		}

		heading = document.createElement("h1");
				content = document.createTextNode(message);
				heading.appendChild(content);

				currentDiv = document.querySelector(".game");
				document.body.appendChild(heading, currentDiv);


}

document.addEventListener('DOMContentLoaded', main);