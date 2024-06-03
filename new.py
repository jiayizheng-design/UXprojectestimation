import tkinter as tk
from tkinter import ttk

class UXProjectEstimator:
    def __init__(self, root):
        self.root = root
        self.root.title("UX Project Estimator")

        # Project details input
        self.create_project_details_input()

        # Task selection
        self.tasks = {
            "User Research": ["Internal", "External", "Analyzing results"],
            "Journey Map": [],
            "User flow diagrams": [],
            "Wireframes": [],
            "Prototype": [],
            "Concept testing meeting": ["ICV review 1", "Implementation Review 1"],
            "Usability testing": ["Preparing user testing scenarios", "Conducting user testing sessions", "Analyzing result"],
            "Refine": ["ICV review 2", "Implementation Review 2", "Making design adjustments based on feedback", "Design Specs", "Sign off meeting"]
        }
        self.selected_tasks = {}
        self.create_task_selection()

        # Calculate button
        self.calculate_button = ttk.Button(root, text="Calculate Project Size", command=self.calculate_project_size)
        self.calculate_button.grid(row=4, column=0, columnspan=2, pady=10)

        # Results display
        self.results_label = tk.Label(root, text="", justify=tk.LEFT)
        self.results_label.grid(row=5, column=0, columnspan=2, pady=10)

    def create_project_details_input(self):
        # Project name input
        tk.Label(self.root, text="Project Name:").grid(row=0, column=0, sticky=tk.W)
        self.project_name_entry = tk.Entry(self.root)
        self.project_name_entry.grid(row=0, column=1)

        # Concurrent works input
        tk.Label(self.root, text="Number of Concurrent Works:").grid(row=1, column=0, sticky=tk.W)
        self.concurrent_works_entry = tk.Entry(self.root)
        self.concurrent_works_entry.grid(row=1, column=1)

        # Regular weekly meeting hours input
        tk.Label(self.root, text="Regular Weekly Meeting Hours:").grid(row=2, column=0, sticky=tk.W)
        self.regular_weekly_meeting_hours_entry = tk.Entry(self.root)
        self.regular_weekly_meeting_hours_entry.grid(row=2, column=1)

    def create_task_selection(self):
        self.task_vars = {}
        self.size_vars = {}

        row = 3
        for task, sub_tasks in self.tasks.items():
            self.task_vars[task] = tk.BooleanVar()
            ttk.Checkbutton(self.root, text=task, variable=self.task_vars[task], command=self.update_task_selection).grid(row=row, column=0, sticky=tk.W)

            if sub_tasks:
                self.size_vars[task] = {}
                for sub_task in sub_tasks:
                    self.size_vars[task][sub_task] = tk.StringVar(value="Select size")
                    ttk.Combobox(self.root, textvariable=self.size_vars[task][sub_task], values=["Select size", "Take a few hours", "Take 1-2 days", "Take several days to a week", "Take 1-2 weeks"]).grid(row=row, column=1, sticky=tk.W)
                    row += 1
            else:
                self.size_vars[task] = tk.StringVar(value="Select size")
                ttk.Combobox(self.root, textvariable=self.size_vars[task], values=["Select size", "Take a few hours", "Take 1-2 days", "Take several days to a week", "Take 1-2 weeks"]).grid(row=row, column=1, sticky=tk.W)
                row += 1

    def update_task_selection(self):
        for task, sub_tasks in self.tasks.items():
            if sub_tasks:
                for sub_task in sub_tasks:
                    if self.task_vars[task].get():
                        self.size_vars[task][sub_task].set("Select size")
                    else:
                        self.size_vars[task][sub_task].set("")

    def calculate_project_size(self):
        size_levels = {
            "Take a few hours": 0.5,
            "Take 1-2 days": 1.5,
            "Take several days to a week": 7,
            "Take 1-2 weeks": 14
        }

        total_days = 0

        for task, sub_tasks in self.tasks.items():
            if self.task_vars[task].get():
                if sub_tasks:
                    for sub_task in sub_tasks:
                        size = self.size_vars[task][sub_task].get()
                        if size != "Select size":
                            total_days += size_levels[size]
                else:
                    size = self.size_vars[task].get()
                    if size != "Select size":
                        total_days += size_levels[size]

        # Add concurrent works days
        concurrent_works = int(self.concurrent_works_entry.get())
        total_days += concurrent_works * 1.5

        # Convert regular weekly meeting hours to days
        regular_weekly_meeting_hours = int(self.regular_weekly_meeting_hours_entry.get())
        total_weeks = total_days / 7
        meeting_days = (regular_weekly_meeting_hours * total_weeks) / 8
        total_days += meeting_days

        # Classify project size
        if total_days <= 21:
            project_size = "Small Project"
        elif 21 < total_days <= 42:
            project_size = "Medium Project"
        else:
            project_size = "Large Project"

        # Display results
        project_name = self.project_name_entry.get()
        result_text = f"Project Name: {project_name}\n"
        result_text += f"Estimated Total Days: {total_days:.2f}\n"
        result_text += f"Project Size Classification: {project_size}"
        self.results_label.config(text=result_text)

if __name__ == "__main__":
    root = tk.Tk()
    app = UXProjectEstimator(root)
    root.mainloop()
