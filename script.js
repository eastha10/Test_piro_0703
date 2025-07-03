const profilePhoto = document.querySelector(".profile-photo");

profilePhoto.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

fetch(
  "https://m.search.naver.com/p/csearch/content/apirender.nhn?where=nexearch&pkid=387&u2=20051029&q=생년월일+운세&u1=m&u3=solar&u4=12&_=1719518803829"
)
  .then((response) => response.json())
  .then((data) => {
    const htmlString = data.flick[0];
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const fortune = doc.querySelector("dd b").textContent;
    const fortuneText = doc.querySelector("dd p").textContent;

    const fortuneSection = document.createElement("section");
    const sectionTitle = document.createElement("h2");
    sectionTitle.textContent = "오늘의 운세";
    const fortuneE = document.createElement("h3");
    fortuneE.style.margin = 0;
    fortuneE.textContent = fortune;
    const fortuneTextE = document.createElement("p");
    fortuneTextE.textContent = fortuneText;

    fortuneSection.append(sectionTitle);
    fortuneSection.append(fortuneE);
    fortuneSection.append(fortuneTextE);

    const contactSection = document.querySelector(".contact");
    contactSection.after(fortuneSection);
    initializeSections();
  });

function initializeSections() {
  const sections = document.querySelectorAll(".right_container section");
  let currentIndex = 0;

  sections.forEach((section, index) => {
    section.style.display = index === 0 ? "flex" : "none";
  });

  const showAfterSection = () => {
    sections.forEach((section) => {
      section.style.display = "none";
    });
    if (currentIndex == sections.length - 1) {
      currentIndex = 0;
    } else {
      currentIndex++;
    }
    sections[currentIndex].style.display = "flex";
  };

  const showBeforeSection = () => {
    sections.forEach((section) => {
      section.style.display = "none";
    });
    if (currentIndex == 0) {
      currentIndex = sections.length - 1;
    } else {
      currentIndex--;
    }
    sections[currentIndex].style.display = "flex";
  };

  let intervalId = setInterval(showAfterSection, 3000);

  const resetInterval = () => {
    clearInterval(intervalId);
    intervalId = setInterval(showAfterSection, 3000);
  };

  sections.forEach((section, index) => {
    section.addEventListener("click", (event) => {
      const sectionWidth = section.offsetWidth;
      const clickX = event.clientX - section.getBoundingClientRect().left;

      if (clickX < sectionWidth / 3) {
        // 왼쪽 1/3 클릭 시 이전 section으로 이동
        showBeforeSection();
        resetInterval();
      } else if (clickX > (sectionWidth * 2) / 3) {
        // 오른쪽 1/3 클릭 시 다음 section으로 이동
        showAfterSection();
        resetInterval();
      } else {
        // 중간 1/3 클릭 시 자동 넘김 토글
        if (intervalId) {
          clearInterval(intervalId); // 자동 넘김 중지
          // intervalId 값은 여전히 남아있으므로 null 값을 넣어줌으로써 더 이상 유효하지 않게 함
          intervalId = null;
        } else {
          intervalId = setInterval(showAfterSection, 3000); // 자동 넘김 재개
        }
      }
    });
  });
}
