let puzzles = {};

const createArrowIcon = () => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute(
    'd',
    'M5.70711 9.71069C5.31658 10.1012 5.31658 10.7344 5.70711 11.1249L10.5993 16.0123C11.3805 16.7927 12.6463 16.7924 13.4271 16.0117L18.3174 11.1213C18.708 10.7308 18.708 10.0976 18.3174 9.70708C17.9269 9.31655 17.2937 9.31655 16.9032 9.70708L12.7176 13.8927C12.3271 14.2833 11.6939 14.2832 11.3034 13.8927L7.12132 9.71069C6.7308 9.32016 6.09763 9.32016 5.70711 9.71069Z'
  );
  path.setAttribute('fill', 'currentColor');

  svg.appendChild(path);
  return svg;
};

const fetchPuzzles = async () => {
  try {
    const response = await fetch('puzzles.json');
    puzzles = await response.json();

    updateContent('3x3');
  } catch (error) {
    console.error('Error fetching puzzle data:', error);
  }
};

const updateContent = (puzzleKey) => {
  const puzzleImage = document.querySelector('.puzzle-image');
  const puzzleName = document.querySelector('#puzzle-name');
  const faqAccordion = document.querySelector('.faq-accordion');
  const newImageSrc = puzzles.puzzles[puzzleKey].image;

  puzzleImage.classList.remove('loaded');
  setTimeout(() => {
    const tempImage = new Image();
    tempImage.src = newImageSrc;

    tempImage.onload = () => {
      puzzleImage.src = newImageSrc;
      puzzleImage.classList.add('loaded');
    };
  }, 300);

  puzzleName.innerText = puzzles.puzzles[puzzleKey].name;

  faqAccordion.innerHTML = '';

  puzzles.puzzles[puzzleKey].faq.forEach((faq) => {
    const faqItem = document.createElement('div');
    const question = document.createElement('h3');
    const answer = document.createElement('p');

    faqItem.classList.add('faq-item');
    question.textContent = faq.question;
    question.classList.add('faq-question');

    const arrowIcon = createArrowIcon();
    question.appendChild(arrowIcon);

    faqItem.appendChild(question);

    answer.innerHTML = marked.parse(faq.answer);
    answer.classList.add('faq-answer');
    faqItem.appendChild(answer);

    question.addEventListener('click', () => {
      if (answer.classList.contains('show')) {
        answer.style.maxHeight = null;
        question.classList.remove('active');
        answer.classList.remove('show');
      } else {
        question.classList.add('active');
        answer.classList.add('show');
        answer.style.maxHeight = answer.scrollHeight + 8 + 'px';
      }
    });

    faqAccordion.appendChild(faqItem);
  });
};

const handleMenuItemClick = (event) => {
  const selectedMenuItem = event.currentTarget;
  const puzzleKey = selectedMenuItem.dataset.puzzle;

  document.querySelectorAll('.menu-item').forEach((item) => {
    item.classList.remove('active');
  });
  selectedMenuItem.classList.add('active');
  updateContent(puzzleKey);
};

fetchPuzzles().then(() => {
  document.querySelectorAll('.menu-item').forEach((menuItem) => {
    menuItem.addEventListener('click', handleMenuItemClick);
  });
});
