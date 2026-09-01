const createElements = (arr) => {
    let htmlElements = arr.map((el) => `<span class="btn">${el}</span>`);
    return (htmlElements.join(" "));
};

const manageSpinner = (status) => {
    if(status === true){
        let spinner = document.getElementById("spinner");
        spinner.classList.remove("hidden")
        let wordContainer =  document.getElementById("word-container");
        wordContainer.classList.add("hidden")
    }
    else{
        let wordContainer =  document.getElementById("word-container");
        wordContainer.classList.remove("hidden")
        let spinner = document.getElementById("spinner");
        spinner.classList.add("hidden")
    }
}

const loadLessons = async () => {
    const res = await fetch("https://openapi.programming-hero.com/api/levels/all");
    const lessonsObject = await res.json();
    displayLessons(lessonsObject.data);
};
loadLessons();

const displayLessons = (lessons) => {
    
    // 1.Get the container & make it empty
    let lessonsContainer = document.getElementById("lessons-container"); 
    lessonsContainer.innerHTML = "";
    
    // 2.Catch each lesson inside the lesson array
    lessons.forEach(lesson => {
        //    3.create element i.e button
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `<button id="lesson-btn-${lesson.level_no}"  onclick="loadLessonWords(${lesson.level_no})" class="btn btn-dash btn-primary lesson-btn"><i class="fa-solid fa-book-open" style="color: rgba(15, 61, 129, 0.886);"></i>lesson-${lesson.level_no}</button>`
        //    4.append element
        lessonsContainer.append(btnDiv);
    });
};

const removeActive = () => {
    const lessonButtons = document.querySelectorAll(".lesson-btn");
    // console.log(lessonButtons);
    lessonButtons.forEach((btn) => btn.classList.remove("active"));
};

const loadLessonWords = async (lesson) => {
    manageSpinner(true);
    const res = await fetch(`https://openapi.programming-hero.com/api/level/${lesson}`)
    const words = await res.json();
    const wordArr = words.data;
    displayLessonWords(wordArr,lesson);
    removeActive(); //remove all active class
    const clickBtn = document.getElementById(`lesson-btn-${lesson}`);
    clickBtn.classList.add("active") //add active class   
};

const loadWordDetails = async (id) => {
    const res = await fetch(`https://openapi.programming-hero.com/api/word/${id}`);
    const data = await res.json();
    displayWordDetails(data.data);
    console.log(data.data);
};

// id: 5
// level: 1
// meaning: "আগ্রহী"
// partsOfSpeech: "adjective"
// points: 1
// pronunciation: "ইগার"
// sentence: "The kids were eager to open their gifts."
// synonyms: (3) ['enthusiastic', 'excited', 'keen']
// word: "Eager"
    const displayWordDetails = async (details) => {
        const detailsContainer = document.getElementById("details-container");
        detailsContainer.innerHTML = `
        <div class="space-y-3">
            <div>
            <h1 class="text-4xl font-semibold">${details.word} (<i class="fa-solid fa-microphone-lines"></i>: ${details.pronunciation})</h1>
            </div>

            <div>
            <h4 class="text-2xl font-semibold">Meaning</h4>
            <p class="text-2xl font-medium">${details.meaning}</p>
            </div>

            <div>
            <h4 class="text-2xl font-semibold">Example</h4>
            <p class="text-2xl text-gray-600">${details.sentence}</p>
            </div>
        
            <div class="space-y-2">
            <p class="bangla-font text-2xl">Synonnyms / সমার্থক শব্দ গুলো</p>
            <div class="">${createElements(details.synonyms)}</div>
            </div>

            <div>
            <button class="btn btn-primary px-5 py-1 rounded-xl">Complete Learning</button>
            </div>
        </div>
        `
        document.getElementById("word_modal").showModal();
    };

const displayLessonWords = (wordArr,lesson) =>{
    let wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = ""; 
    
    if(wordArr.length === 0){
    wordContainer.innerHTML = `
    <div class="bangla-font bg-[#00bbff34] w-10/12 p-10 rounded-2xl space-y-3">
            <img class="mx-auto" src="./assets/alert-error.png" alt="">
            <p class="text-[#79716B] text-[20px]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="text-[#292524] text-[34.31px] font-medium">নেক্সট Lesson এ যান</h2>
    </div>
    `; 

    }

    wordArr.forEach((wordElement) => {
        console.log(wordElement.length);
        const wordCard = document.createElement("div");
        wordCard.innerHTML = `<div class="card bg-white rounded-2xl shadow-sm w-[350px] md:w-[400px] h-[280px] text-center space-y-3 p-8">
            <div class="space-y-3">
              <h3 class="text-3xl font-bold pt-3">${wordElement.word ? wordElement.word : "শব্দ পাওয়া যায়নি"}</h3>
              <p class="text-[20px]">Meaning / Pronunciation</p>
              <p class="text-[25px] font-semibold text-[#18181bc1] bangla-font">${wordElement.meaning? wordElement.meaning : "অর্থ পাওয়া যায়নি"} / ${wordElement.pronunciation ? wordElement.pronunciation : "উচ্চারণ পাওয়া যায়নি"}</p>
            </div>
            <div class="flex justify-between">
               <button onclick="loadWordDetails(${wordElement.id})" class="p-2 bg-[#399fed41] rounded-sm hover:bg-[#399fedba] cursor-pointer ..."><i class="fa-solid fa-circle-info" style="color: rgb(16, 32, 55);"></i></button>
               <button class="p-2 bg-[#399fed41] rounded-sm hover:bg-[#399fedba] cursor-pointer ..."> <i class="fa-solid fa-volume" style="color: rgb(16, 32, 55);"></i></button>
              
            </div>
          </div>`;

        wordContainer.append(wordCard);
    });
    manageSpinner(false);
};


document.getElementById("btn-search").addEventListener("click",async ()  => {
  removeActive();
  const input = document.getElementById("input-search");
  const searchValue = input.value.trim().toLowerCase();
  console.log(searchValue);

  const res = await fetch("https://openapi.programming-hero.com/api/words/all");
  const data = await res.json();
  const allWords = data.data;
  console.log(allWords);
  const filterWords = allWords.filter((word) => word.word.toLowerCase().includes(searchValue));
  console.log(filterWords);
  displayLessonWords(filterWords);
  
    // .then((res) => res.json())
    // .then((data) => {
    //   const allWords = data.data;
    //   const filterWords = allWords.filter((word) =>
    //     word.word.toLowerCase().includes(searchValue)
    //   

    //   
    // });
});

