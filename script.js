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
  XS: { description: 'Quick and simple tasks that take a few hours.', days: 0.5 },
  S: { description: 'Tasks that can be completed within a day or two.', days: 1.5 },
  M: { description: 'Moderate tasks that take several days to a week.', days: 7 },
  L: { description: 'Complex tasks requiring one to two weeks.', days: 14 },
  XL: { description: 'Very complex tasks that might take multiple weeks.', days: 21 }
};

const taskList = document.getElementById('task-list');

tasks.forEach((task, index) => {
  const taskDiv = document.createElement('div');
  taskDiv.className = 'mb-4';

  const taskLabel = document.createElement('label');
  taskLabel.className = 'block text-lg font-semibold mb-2 cursor-pointer';
  taskLabel.innerText = task.name;
  taskLabel.addEventListener('click', () => toggleOptions(index));
  taskDiv.appendChild(taskLabel);

  const optionsDiv = document.createElement('div');
  optionsDiv.id = `options-${index}`;
  optionsDiv.className = 'ml-4 hidden';

  if (task.options.length > 0) {
    task.options.forEach(option => {
      const optionDiv = document.createElement('div');
      optionDiv.className = 'mb-2';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `task-${index}-${option}`;
      checkbox.name = `task-${index}`;
      checkbox.value = option;
      checkbox.className = 'mr-2';
      optionDiv.appendChild(checkbox);

      const label = document.createElement('label');
      label.htmlFor = `task-${index}-${option}`;
      label.innerText = option;
      optionDiv.appendChild(label);

      const sizeSelect = document.createElement('select');
      sizeSelect.id = `size-${index}-${option}`;
      sizeSelect.className = 'ml-2 p-1 border rounded';
      Object.keys(sizeLevels).forEach(size => {
        const optionElement = document.createElement('option');
        optionElement.value = size;
        optionElement.innerText = size;
        optionElement.title = sizeLevels[size].description;
        sizeSelect.appendChild(optionElement);
      });
      optionDiv.appendChild(sizeSelect);

      optionsDiv.appendChild(optionDiv);
    });
  } else {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'mb-2';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `task-${index}`;
    checkbox.name = `task-${index}`;
    checkbox.value = task.name;
    checkbox.className = 'mr-2';
    optionDiv.appendChild(checkbox);

    const label = document.createElement('label');
    label.htmlFor = `task-${index}`;
    label.innerText = task.name;
    optionDiv.appendChild(label);

    const sizeSelect = document.createElement('select');
    sizeSelect.id = `size-${index}`;
    sizeSelect.className = 'ml-2 p-1 border rounded';
    Object.keys(sizeLevels).forEach(size => {
      const optionElement = document.createElement('option');
      optionElement.value = size;
      optionElement.innerText = size;
      optionElement.title = sizeLevels[size].description;
      sizeSelect.appendChild(optionElement);
    });
    optionDiv.appendChild(sizeSelect);

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

  tasks.forEach((task, index) => {
    const optionsDiv = document.getElementById(`options-${index}`);
    if (task.options.length > 0) {
      task.options.forEach(option => {
        const checkbox = document.getElementById(`task-${index}-${option}`);
        if (checkbox.checked) {
          selectedTasks.push(`${task.name} - ${option}`);
          const sizeSelect = document.getElementById(`size-${index}-${option}`);
          const sizeValue = sizeSelect.value;
          if (sizeValue === 'XL') {
            alert('Please break down the task for more accurate estimation.');
            return;
          }
          totalDays += sizeLevels[sizeSelect.value].days;
        }
      });
    } else {
      const checkbox = document.getElementById(`task-${index}`);
      if (checkbox.checked) {
        selectedTasks.push(task.name);
        const sizeSelect = document.getElementById(`size-${index}`);
        const sizeValue = sizeSelect.value;
        if (sizeValue === 'XL') {
          alert('Please break down the task for more accurate estimation.');
          return;
        }
        totalDays += sizeLevels[sizeSelect.value].days;
      }
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
    <h2 class="text-xl font-bold">Project Size: ${projectSize}</h2>
    <p>Total Days: ${totalDays}</p>
    <p>Selected Tasks:</p>
    <ul class="list-disc ml-6">${selectedTasks.map(task => `<li>${task}</li>`).join('')}</ul>
  `;
}
