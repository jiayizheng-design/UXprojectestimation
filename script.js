const tasks = [
  {
    name: 'User Research',
    options: ['Internal', 'External', 'Analyzing results']
  },
  { name: 'Concept testing', options: [] },
  { name: 'Journey Map', options: [] },
  { name: 'User flow diagrams', options: [] },
  { name: 'Wireframes', options: [] },
  { name: 'Prototype', options: [] },
  {
    name: 'Usability testing',
    options: ['Preparing user testing scenarios', 'Conducting user testing sessions', 'Analyzing result']
  },
  {
    name: 'Design reviews and iterations',
    options: ['Making design adjustments based on feedback', 'Design Specs', 'Sign off meeting']
  }
];

const sizeLevels = {
  'Take a few hours': { description: 'Quick and simple tasks that take a few hours.', days: 0.5 },
  'Take 1-2 days': { description: 'Tasks that can be completed within a day or two.', days: 1.5 },
  'Take several days to a week': { description: 'Moderate tasks that take several days to a week.', days: 7 },
  'Take 1-2 weeks': { description: 'Complex tasks requiring one to two weeks.', days: 14 }
};

const taskList = document.getElementById('task-list');

tasks.forEach((task, index) => {
  const taskDiv = document.createElement('div');
  taskDiv.className = 'mb-4';

  const taskLabel = document.createElement('label');
  taskLabel.className = 'block text-lg font-semibold mb-2 cursor-pointer';
  taskLabel.innerText = task.name;
  
  const taskCheckbox = document.createElement('input');
  taskCheckbox.type = 'checkbox';
  taskCheckbox.className = 'mr-2';
  taskCheckbox.addEventListener('change', () => toggleOptions(index));
  taskLabel.prepend(taskCheckbox);
  
  taskDiv.appendChild(taskLabel);

  const optionsDiv = document.createElement('div');
  optionsDiv.id = `options-${index}`;
  optionsDiv.className = 'ml-4 hidden';

  if (task.options.length > 0) {
    task.options.forEach(option => {
      const optionDiv = document.createElement('div');
      optionDiv.className = 'mb-2';

      const optionLabel = document.createElement('label');
      optionLabel.innerText = option;
      optionDiv.appendChild(optionLabel);

      Object.keys(sizeLevels).forEach(size => {
        const sizeDiv = document.createElement('div');
        sizeDiv.className = 'inline-block mr-4';

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = `size-${index}-${option}`;
        radio.value = size;
        radio.className = 'mr-2';
        sizeDiv.appendChild(radio);

        const radioLabel = document.createElement('label');
        radioLabel.innerText = size;
        radioLabel.title = sizeLevels[size].description;
        sizeDiv.appendChild(radioLabel);

        optionDiv.appendChild(sizeDiv);
      });

      optionsDiv.appendChild(optionDiv);
    });
  } else {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'mb-2';

    const optionLabel = document.createElement('label');
    optionLabel.innerText = task.name;
    optionDiv.appendChild(optionLabel);

    Object.keys(sizeLevels).forEach(size => {
      const sizeDiv = document.createElement('div');
      sizeDiv.className = 'inline-block mr-4';

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = `size-${index}`;
      radio.value = size;
      radio.className = 'mr-2';
      sizeDiv.appendChild(radio);

      const radioLabel = document.createElement('label');
      radioLabel.innerText = size;
      radioLabel.title = sizeLevels[size].description;
      sizeDiv.appendChild(radioLabel);

      optionDiv.appendChild(sizeDiv);
    });

    optionsDiv.appendChild(optionDiv);
  }

  taskDiv.appendChild(optionsDiv);
  taskList.appendChild(taskDiv);
});

function toggleOptions(index) {
  const optionsDiv = document.getElementById(`options-${index}`);
  optionsDiv.classList.toggle('hidden');
}

function calculateProjectSize() {
  let totalDays = 0;
  const selectedTasks = [];
  const projectName = document.getElementById('project-name').value;

  tasks.forEach((task, index) => {
    const optionsDiv = document.getElementById(`options-${index}`);
    if (task.options.length > 0) {
      task.options.forEach(option => {
        const radios = document.getElementsByName(`size-${index}-${option}`);
        radios.forEach(radio => {
          if (radio.checked) {
            selectedTasks.push(`${task.name} - ${option}`);
            const sizeValue = radio.value;
            totalDays += sizeLevels[sizeValue].days;
          }
        });
      });
    } else {
      const radios = document.getElementsByName(`size-${index}`);
      radios.forEach(radio => {
        if (radio.checked) {
          selectedTasks.push(task.name);
          const sizeValue = radio.value;
          totalDays += sizeLevels[sizeValue].days;
        }
      });
    }
  });

  const concurrentTasks = parseInt(document.getElementById('concurrent-tasks').value);
  totalDays += concurrentTasks * 1.5;

  let projectSize = '';
  if (totalDays <= 21) {
    projectSize = 'Small Project';
  } else if (totalDays <= 42) {
    projectSize = 'Medium Project';
  } else {
    projectSize = 'Large Project';
  }

  document.getElementById('result').innerHTML = `
    <h2 class="text-xl font-bold">Project Name: ${projectName}</h2>
    <h2 class="text-xl font-bold">Project Size: ${projectSize}</h2>
    <p>Total Days: ${totalDays}</p>
    <p>Selected Tasks:</p>
    <ul class="list-disc ml-6">${selectedTasks.map(task => `<li>${task}</li>`).join('')}</ul>
  `;
}