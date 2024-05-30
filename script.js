 document.querySelectorAll('.task').forEach(task => {
            task.addEventListener('change', function() {
                const subtaskGroup = this.nextElementSibling;
                if (this.checked) {
                    if (subtaskGroup && subtaskGroup.classList.contains('subtask-group')) {
                        subtaskGroup.classList.remove('hidden');
                    } else {
                        document.getElementById('size-levels').classList.remove('hidden');
                    }
                } else {
                    if (subtaskGroup && subtaskGroup.classList.contains('subtask-group')) {
                        subtaskGroup.classList.add('hidden');
                        subtaskGroup.querySelectorAll('.subtask').forEach(subtask => subtask.checked = false);
                    }
                    document.getElementById('size-levels').classList.add('hidden');
                    document.querySelectorAll('[name="size-level"]').forEach(size => size.checked = false);
                }
            });
        });

        document.querySelectorAll('.subtask').forEach(subtask => {
            subtask.addEventListener('change', function() {
                document.getElementById('size-levels').classList.toggle('hidden', !document.querySelector('.subtask:checked'));
            });
        });

        function calculateProjectSize() {
            const projectName = document.getElementById('project-name').value;
            const concurrentWorks = parseInt(document.getElementById('concurrent-works').value) || 0;
            const weeklyMeetings = parseInt(document.getElementById('weekly-meetings').value) || 0;
            let totalDays = concurrentWorks * 1.5;

            document.querySelectorAll('.task:checked, .subtask:checked').forEach(task => {
                const size = document.querySelector('[name="size-level"]:checked');
                if (size) {
                    totalDays += parseFloat(size.value);
                }
            });

            const weeks = totalDays / 7;
            totalDays += (weeks * weeklyMeetings) / 7;

            let projectSize;
            if (totalDays <= 21) {
                projectSize = 'Small Project';
            } else if (totalDays <= 42) {
                projectSize = 'Medium Project';
            } else {
                projectSize = 'Large Project';
            }

            document.getElementById('result-project-name').textContent = projectName;
            document.getElementById('result-total-days').textContent = totalDays.toFixed(2);
            document.getElementById('result-tasks').textContent = Array.from(document.querySelectorAll('.task:checked, .subtask:checked')).map(task => task.parentElement.textContent.trim()).join(', ');
            document.getElementById('result-size').textContent = projectSize;

            document.getElementById('project-result').classList.remove('hidden');
        }
