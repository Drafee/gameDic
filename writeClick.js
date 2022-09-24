document.addEventListener('DOMContentLoaded', main);
async function main(){
    const heart = document.querySelector('.heart');

    const URL = window.location.href;
    const res = await fetch(URL + '/love');
    const results = await res.json();
    if (results){
        heart.style.color = 'rgb(185, 69, 69)';
    } else {
        heart.style.color = 'rgb(185, 69, 69, 0.4)';
    }
    const writeBtn = document.querySelector('.writeBtn');

    writeBtn.addEventListener('click', handleClick);
    heart.addEventListener('click', handleHeartClick);
    heart.addEventListener('mouseover', mouseOverHeart);
    heart.addEventListener('mouseleave', mouseLeaveHeart);


    function mouseOverHeart(evt){
        if (heart.style.color === 'rgb(185, 69, 69)'){
            heart.style.color = 'rgb(185, 69, 69, 0.4)';
        } else {
            heart.style.color = 'rgb(185, 69, 69)';
        }
    }

    function mouseLeaveHeart(evt){
        if (heart.style.color === 'rgb(185, 69, 69)'){
            heart.style.color = 'rgb(185, 69, 69, 0.4)';
        } else {
            heart.style.color = 'rgb(185, 69, 69)';
        }
    }

    async function handleHeartClick(evt){
        let config = 0;
        if (heart.style.color !== 'rgb(185, 69, 69)'){
            // delete the love
            config = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({msg: 'delete'})
            };
        } else {
            // add to the love

            config = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({msg: 'add'})
            };
        }

        const res = await fetch(URL + '/love', config);
        if (heart.style.color === 'rgb(185, 69, 69)'){
            heart.style.color = 'rgb(185, 69, 69, 0.4)';
        } else {
            heart.style.color = 'rgb(185, 69, 69)';
        } 

    }

    async function handleClick(evt){
        evt.preventDefault();
        const contents = document.querySelector('.write').value;
        const URL = window.location.href;
        const config = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({content: contents})
        };
        const res = await fetch(URL, config);
        const saves = await res.json();

        const table = document.querySelector('.reviewsTable');
        const tr = document.createElement('tr');
        table.appendChild(tr);
        const td1 = document.createElement('td');
        td1.classList.add('reviewDate');
        const td2 = document.createElement('td');
        td2.classList.add('reviewUser');
        const td3 = document.createElement('td');
        td3.classList.add('reviewContent');
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        td2.innerHTML = saves.user ;
        td1.innerHTML = saves.date.toString();
        td3.innerHTML = saves.contents;
        document.querySelector('.write').value = '';
    }

}


