const reviewBtn = document.querySelector('.myReviewBtn');

const favoBtn = document.querySelector('.favoratesLink');

reviewBtn.addEventListener('click', handleReviewClick);
favoBtn.addEventListener('click', handleFavoClick);

async function handleReviewClick(evt){
    evt.preventDefault();
    if (document.querySelector('.myFavoDiv')){
        document.querySelector('.myFavoDiv').remove();
    }
    if (!document.querySelector('.myReviewDiv')){
        const myReviewDiv = document.createElement('div');
        myReviewDiv.classList.add('myReviewDiv');
        document.querySelector('.userInterface').appendChild(myReviewDiv);
        const res = await fetch(window.location.href + '/reviews');
        const reviews = await res.json();

        const myReviewTable = document.createElement('table'); 
        myReviewTable.classList.add('myReviewTable');
        myReviewDiv.appendChild(myReviewTable);

        const myReviewLabel = document.createElement('label');
        myReviewLabel.classList.add('myReviewLabel');
        myReviewLabel.innerHTML = 'My Reviews';
        myReviewTable.appendChild(myReviewLabel);

        for (const i of reviews){
            const myReviewTr = document.createElement('tr'); 
            myReviewTable.appendChild(myReviewTr);
            const myReviewTd1 = document.createElement('td');
            myReviewTd1.classList.add('td1');
            myReviewTd1.innerHTML = i.game;
            myReviewTr.appendChild(myReviewTd1);

            const myReviewTd2 = document.createElement('td');
            myReviewTd2.classList.add('td2');
            myReviewTd2.innerHTML = i.contents;
            myReviewTr.appendChild(myReviewTd2);

            const myReviewTd3 = document.createElement('td');
            myReviewTd3.classList.add('td3');
            myReviewTd3.innerHTML = i.date;
            myReviewTr.appendChild(myReviewTd3);
        }  
    }
}


async function handleFavoClick(evt){
    evt.preventDefault();
    if (document.querySelector('.myReviewDiv')){
        document.querySelector('.myReviewDiv').remove();
    }
    if (!document.querySelector('.myFavoDiv')){
        const myFavoDiv = document.createElement('div');
        myFavoDiv.classList.add('myFavoDiv');
        document.querySelector('.userInterface').appendChild(myFavoDiv);

        const res = await fetch(window.location.href + '/favorates');
        const favos = await res.json();

        const myFavoTable = document.createElement('table'); 
        myFavoTable.classList.add('myFavoTable');
        myFavoDiv.appendChild(myFavoTable);

        const myFavoLabel = document.createElement('label');
        myFavoLabel.classList.add('myFavoLabel');
        myFavoLabel.innerHTML = 'My Favorates';
        myFavoTable.appendChild(myFavoLabel);

        for (const i of favos){
            const myFavoTr = document.createElement('tr'); 
            myFavoTable.appendChild(myFavoTr);
            const myFavoTd1 = document.createElement('td');
            myFavoTd1.classList.add('tdfavo');
            const link = document.createElement('a');
            link.href = `./${i.name}`;
            link.innerHTML = i.name;
            myFavoTd1.appendChild(link);
            myFavoTr.appendChild(myFavoTd1);
        }  
    }


}