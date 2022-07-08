// Встановлюємо швидкість руху
let move_speed = 4;

// Значення сили тяжіння
let gravity = 0.5;

// Отримання посилання на елемент bird
let bird = document.querySelector(".bird");

// Отримання властивостей елементів пташки та фону
let bird_props = bird.getBoundingClientRect();
let background = document.querySelector(".background").getBoundingClientRect();
let ground = document.querySelector(".ground").getBoundingClientRect();

//властивості елементу лічильника балів
let score_val = document.querySelector(".score_val");
let message = document.querySelector(".message");
let score_title = document.querySelector(".score_title");

//Встановлення початкового стану гри для старту гри
let game_state = "Start";

// Створення вікна початку гри
let startButton = document.querySelector("#start button");
let startBlock = document.querySelector("#start");
let endBlock = document.querySelector("#end");
let restartButton = document.querySelector("#end button");

// Кнопка старт
startButton.onclick = function () {
  startGame();
  gameAudio();
};

// Початок игры
function startGame() {
  startBlock.style.display = "none";

  // Переніс сюди умови початку гри
  document.querySelectorAll(".pipe_sprite").forEach((e) => {
    e.remove();
  });
  bird.style.top = "40vh";
  game_state = "Play";
  // message.innerHTML = "";
  //Лічильник балів
  score_title.innerText = "Балы : ";
  score_val.innerText = "0";
  play();
}

// Аудіосупровід

let audio_1 = document.getElementById("audio_1");
let audio_2 = document.getElementById("audio_2");
let audio_3 = document.getElementById("audio_3");

audio_1.volume = 0.1;
audio_2.volume = 0.5;
audio_3.volume = 0.1;

let startAudio = setTimeout(audio_1.play(), 1500);

function gameAudio() {
  audio_1.pause();
  audio_2.play();
}

function endAudio() {
  audio_2.pause();
  if (endBlock.style.display == "block") {
    audio_3.play();
  } else {
    audio_3.pause();
  }
}

//
function play() {
  function move() {
    //Визначити, чи гра закінчилася
    if (game_state != "Play") return;

    //Отримання посилання на елемент pipe
    let pipe_sprite = document.querySelectorAll(".pipe");
    pipe_sprite.forEach((element) => {
      let pipe_sprite_props = element.getBoundingClientRect();
      bird_props = bird.getBoundingClientRect();

      // Видалити труби, якщо вони вийшли за межі екрану
      if (pipe_sprite_props.right <= 0) {
        element.remove();
      } else {
        //Умови зіткнення пташки з колонами
        if (
          (bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
            bird_props.left + bird_props.width > pipe_sprite_props.left &&
            bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
            bird_props.top + bird_props.height > pipe_sprite_props.top) ||
          bird_props.top <= 0 ||
          bird_props.bottom >= background.bottom
        ) {
          // Завершення гри
          game_state = "End";

          // видалення труб
          pipe_sprite.forEach((element) => {
            element.remove();
          });
          // відображення вікна
          endBlock.style.display = "block";
          endAudio();
          // приховування рахунку у грі
          score_val.style.display = "none";
          score_title.style.display = "none";
          // відображення рахунку у вікні
          let scoreBlock = document.querySelector("#end h3 span");
          scoreBlock.innerText = score_val.innerText;
          return;
        } else {
          //Збільште рахунок, якщо пташка пролетіла між колонами
          if (
            pipe_sprite_props.right < bird_props.left &&
            pipe_sprite_props.right + move_speed >= bird_props.left &&
            element.increase_score == "1"
          ) {
            score_val.innerText = +score_val.innerText + 1;
          }
          element.style.left = pipe_sprite_props.left - move_speed + "px";
        }
      }
    });
    //Анімація колон
    requestAnimationFrame(move);
  }
  requestAnimationFrame(move);
  //Умови польоту пташки при натисканні клавіші "Enter"/"пробіл"
  let bird_dy = 0;

  function apply_gravity() {
    if (game_state != "Play") return;
    bird_dy = bird_dy + gravity;
    document.addEventListener("keydown", (e) => {
      if (e.key == "Enter" || e.key == " ") {
        bird_dy = -7.6;
      }
    });

    bird.style.top = bird_props.top + bird_dy + "px";
    bird_props = bird.getBoundingClientRect();
    requestAnimationFrame(apply_gravity);
  }
  requestAnimationFrame(apply_gravity);

  let pipe_seperation = 0;

  //Проміжок між трубами
  let pipe_gap = 35;

  function create_pipe() {
    if (game_state != "Play") return;

    //Створення нових пар колон якщо відстань між іншими парами перебільшено
    if (pipe_seperation > 115) {
      pipe_seperation = 10;

      // Рандомне значення проміжку між колонами
      let pipe_posi = Math.floor(Math.random() * 43) + 8;
      let pipe_sprite_inv = document.createElement("div");
      pipe_sprite_inv.className = "pipe_sprite_inv pipe";
      pipe_sprite_inv.style.top = pipe_posi - 70 + "vh";
      pipe_sprite_inv.style.left = "100vw";

      //Створення колон
      document.body.appendChild(pipe_sprite_inv);
      let pipe_sprite = document.createElement("div");
      pipe_sprite.className = "pipe_sprite pipe";
      pipe_sprite.style.top = pipe_posi + pipe_gap + "vh";
      pipe_sprite.style.left = "100vw";
      pipe_sprite.increase_score = "1";

      document.body.appendChild(pipe_sprite);
    }
    pipe_seperation++;
    requestAnimationFrame(create_pipe);
  }
  requestAnimationFrame(create_pipe);
}

// Кнопка рестарт
restartButton.onclick = function () {
  location.reload();
};
