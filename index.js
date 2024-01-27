const width = 40;
const height = 24;
const fieldGame = generateFieldGame();
const fieldGameElement = document.querySelector('.field');
const numberOfRooms = getRandomNum(5, 6);
const numberOfYChannels = getRandomNum(3, 3);
const numberOfXChannels = getRandomNum(3, 3);
const indexOfItems = [];
let whereIsHero = {};
let damage = 25;
const hpScale = document.createElement('div');
hpScale.className = 'health';
hpScale.style.width = '100%';

function getRandomNum(min, max) {
    return min + Math.floor(Math.random() * max);
};

function generateFieldGame() {
    let arr = [];
    for ( let i = 0; i < height; i++ ) {
        arr[i] = [];
                for (let j = 0; j < width; j++) {
                    arr[i][j] = {
                    type: 'tileW',
                    };
                }
    }
    return arr;
};

function generateYChannel() {
    let coordChannel = getRandomNum(1, 38);
    
    for ( let i = 0; i < height; i++ ) {
        if ( fieldGame[0][coordChannel+1].type == 'tile' ||
            fieldGame[0][coordChannel-1].type == 'tile') {
                i--;
                coordChannel = getRandomNum(1, 38);
                continue;
            }
        fieldGame[i][coordChannel].type = 'tile';
    }
};

function generateXChannel() {
    let coordChannel = getRandomNum(1, 22);
    for ( let i = 0; i < width; i++ ) {
        if ( fieldGame[coordChannel+1][0].type == 'tile' ||
            fieldGame[coordChannel-1][0].type == 'tile' ) {
                i--;
                coordChannel = getRandomNum(1, 22);
                continue;
        }
        fieldGame[coordChannel][i].type = 'tile';
    } 
};

function generateChannels() {
    for ( let i = 0; i < numberOfYChannels; i++ ){
        generateYChannel();
    }

    for ( let i = 0; i < numberOfXChannels; i++ ) {
        generateXChannel();
    }
};

generateChannels();

function checkAttainability(startY, startX, roomWidth, roomHeight) {
    for ( let i = startX - 1; i <= startX + roomWidth; i++ ) {
        if ( fieldGame[startY - 1][i].type == 'tileW' ) {
            for ( let j = startY; j <= startY + roomHeight; j++ ){
                if ( fieldGame[j][startX - 1].type == 'tileW' ) {
                    return true;
                }
            } 
        }
     return false;
    }
};

function generateOneRoom() {
    const roomWidth = getRandomNum(3, 6);
    const roomHeight = getRandomNum(3, 6);
    const startX = getRandomNum(1, width - roomWidth - 1); 
    const startY = getRandomNum(1, height - roomHeight - 1);

    if ( checkAttainability( startY, startX, roomWidth, roomHeight ) ) {
        return generateOneRoom();
    }
        for (let i = startY; i < startY + roomHeight; i++) {
            for (let j = startX; j < startX + roomWidth; j++) {
                fieldGame[i][j].type = 'tile';
            }
        }
};

function generateRooms() {
    let i = 0;
        while ( i < numberOfRooms ) {
            generateOneRoom();
            i++;
        }
};

generateRooms()

function addItem(itemName) {
    let randomYIndex = getRandomNum(0, height );
    let randomXIndex = getRandomNum(0, width );
        if ( fieldGame[randomYIndex][randomXIndex].type === 'tile' ) {
            fieldGame[randomYIndex][randomXIndex].type = `${itemName}`;
            return;
        }
    return addItem(itemName);  
};

function addAllItems() {
    addItem('tileP');
    for ( let i = 0; i < 2; i ++ ){
        addItem('tileSW');
    }
    for ( let j = 0; j < 10; j++ ){
        addItem('tileHP');
    }
    for ( let j = 0; j < 10; j++ ){
        addItem('tileE');
    } 
};

addAllItems()

function buildMap() {
for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
        const block = document.createElement('div');
    if ( fieldGame[i][j].type === 'tileW'){
        block.className = 'tileW';
    }else if (
        fieldGame[i][j].type === 'tile'
    ){
        block.className = 'tile';
    } else if (
        fieldGame[i][j].type === 'tileP'
    ){
        block.className = 'tileP';
        whereIsHero.i = i;
        whereIsHero.j = j;
        whereIsHero.hp = 100;
    } else if (
        fieldGame[i][j].type === 'tileSW'
    ){
        block.className = 'tileSW';
    } else if (
        fieldGame[i][j].type === 'tileHP'
    ){
        block.className = 'tileHP';
    } else if (
        fieldGame[i][j].type === 'tileE'
    ){
        block.className = 'tileE';
        indexOfItems.push({subject: 'tileE', yIndex: i, XIndex: j, hp: 100});
    }
    fieldGameElement.append(block);
    }
}
}

buildMap()

function prevDamage() {
    damage -=  25;
};

const fieldGameAllElements = Array.from(document.querySelector('.field').children);
let hero = document.querySelector('.tileP');
hero.append(hpScale);
const enemies = document.querySelectorAll('.tileE');

function enemyDead(i, enemy) {
    indexOfItems[i].subject = 'tile';
    fieldGame[indexOfItems[i].yIndex][indexOfItems[i].XIndex].type = 'tile';
    fieldGameAllElements[enemy.yIndex * width + enemy.XIndex].className = 'tile';
};

function takeDamage(i, enemy) {
    indexOfItems[i].hp = +indexOfItems[i].hp - damage;
    arrHpE[i].style.width = indexOfItems[i].hp + '%';
        if ( +indexOfItems[i].hp <= 0 ){
            enemyDead(i, enemy);  
        }
};

function handlerMoveP(y, x, nextBlock, direct, z) {
    if ( nextBlock === undefined ) return;
    let typeOfBlock = nextBlock.type === 'tile' 
    ? 'tile' 
    : nextBlock.type === 'tileHP' 
    ? 'tileHP' 
    : nextBlock.type === 'tileSW' 
    ? 'tileSW' : false;
    if ( typeOfBlock ){
        nextBlock.type = 'tileP';
        fieldGame[y][x].type = 'tile';
        hero.className = 'tile';
            if ( direct === 'horizon'){
                whereIsHero.j = +whereIsHero.j + z;
                fieldGameAllElements[y * width + whereIsHero.j].className = 'tileP';
            } else{
                whereIsHero.i = +whereIsHero.i + z;
                fieldGameAllElements[whereIsHero.i * width + x].className = 'tileP';
            }
    }

    if ( typeOfBlock === 'tileHP'){
        if ( hpScale.style.width !== '100%') {
            whereIsHero.hp = +whereIsHero.hp + 25;
            hpScale.style.width = whereIsHero.hp + '%';}
    }
    if ( typeOfBlock === 'tileSW'){
        damage += 25;
        setTimeout(prevDamage, 7000);
    }
    hero = document.querySelector('.tileP');
    hero.append(hpScale);  
};

document.addEventListener("keydown", (e) => {
    let y = +whereIsHero.i;
    let x = +whereIsHero.j;

    if ( (e.key === 'w' || e.key === 'ц') ) {

        let nextBlock = fieldGame[y - 1]?.[x];
        handlerMoveP(y, x, nextBlock, 'vertical', -1);

    }else if ( (e.key === 'd' || e.key === 'в') ) {

        let nextBlock = fieldGame[y]?.[x + 1];
        handlerMoveP(y, x, nextBlock, 'horizon', 1);

    }else if ( (e.key === 'a' || e.key === 'ф') ) {

        let nextBlock = fieldGame[y]?.[x - 1];
        handlerMoveP(y, x, nextBlock, 'horizon', -1);
 
    }else if ( (e.key === 's' || e.key === 'ы') ){

        let nextBlock = fieldGame[y + 1]?.[x];
        handlerMoveP(y, x, nextBlock, 'vertical', 1);

    }else if ( e.key === ' '){

        indexOfItems.forEach(function(enemy) {
            const enemyY = enemy.yIndex;
            const enemyX = enemy.XIndex;
            if (enemy.subject === 'tile') return;
            
            if ((Math.abs(whereIsHero.j - enemyX) === 1 &&
                ((whereIsHero.i === enemyY || Math.abs(whereIsHero.i - enemyY) === 1))) ||
                (Math.abs(whereIsHero.i - enemyY) === 1 &&
                whereIsHero.j === enemyX)) {

                    takeDamage(indexOfItems.indexOf(enemy), enemy);
            }
            });
    }
});

function createHpScaleE() {
    let arrOfHpScaleE = [];
        for ( let i = 0; i < enemies.length; i++ ){
            const hpScaleE = document.createElement('div');
            hpScaleE.className = 'health';
            hpScaleE.style.width = '100%';
            arrOfHpScaleE.push(hpScaleE);
        }
    return arrOfHpScaleE;
};

function appendHpSlaceE() {
    let arr = createHpScaleE();
        for ( let i = 0; i < enemies.length; i++ ){
            enemies[i].append(arr[i]);
        }
    return arr;
};

let arrHpE = appendHpSlaceE();

function isBlockWithinField(y, x) {
    if (y < 0 || y >= height || x < 0 || x >= width) {
        return false; 
    }
    return fieldGame[y][x].type === 'tile';
};

function getAvailableDirectionsEnemy(y, x) {
    const directions = [];
    if (isBlockWithinField(y, x - 1)) { 
            directions.push({ y, x: x - 1 });
    }
    if (isBlockWithinField(y, x + 1)) { 
            directions.push({ y, x: x + 1 });
    }
    if (isBlockWithinField(y - 1, x)) { 
            directions.push({ y: y - 1, x });
    }
    if (isBlockWithinField(y + 1, x)) { 
            directions.push({ y: y + 1, x });
    }
    return directions;
};

function getRandomDirectionEnemy(arr) {
    return arr[getRandomNum(0, arr.length)];
};

function heroIsNear(i) {

    if ((Math.abs(indexOfItems[i].XIndex - whereIsHero.j) === 1 &&
        indexOfItems[i].yIndex === whereIsHero.i) ||
        (Math.abs(indexOfItems[i].yIndex - whereIsHero.i) === 1 &&
        indexOfItems[i].XIndex === whereIsHero.j)
        )
        {
            whereIsHero.hp = +whereIsHero.hp - 25;
            hpScale.style.width = whereIsHero.hp + '%';
            if ( whereIsHero.hp == '0'){
                setTimeout(() => alert('Game over! Please press Ctrl + R and try again'), 500);
            }
        }
};

function move() {

    for ( let i = 0; i < indexOfItems.length; i ++ ){
        if ( indexOfItems[i].subject === 'tile' ) continue;
        heroIsNear(i);  
        const y = +indexOfItems[i].yIndex;
        const x = +indexOfItems[i].XIndex;
        
        let moves = getAvailableDirectionsEnemy(y, x);
 
        if (moves. length > 0){
            const newDirection = getRandomDirectionEnemy(moves);

            fieldGame[newDirection.y][newDirection.x].type = 'tileE';
            fieldGame[y][x].type = 'tile';
    
            fieldGameAllElements[y * width + x].className = 'tile';

            indexOfItems[i].yIndex = newDirection.y;
            indexOfItems[i].XIndex = newDirection.x;

            fieldGameAllElements[newDirection.y * width + newDirection.x].className = 'tileE';

            fieldGameAllElements[newDirection.y * width + newDirection.x].append(arrHpE[i]);

        } 
        heroIsNear(i);   
    }
};

let moveEnemies = setInterval(move,800);